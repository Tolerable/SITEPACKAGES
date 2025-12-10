const { createClient } = require('@supabase/supabase-js');

// Role hierarchy levels
const ROLE_LEVELS = {
  'OWNER': 4,
  'ADMIN': 3,
  'MODERATOR': 2,
  'USER': 1
};

async function getUserRole(supabase, userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) return 'USER';
  return data.role;
}

async function checkPermission(supabase, requesterId, targetId = null, requiredLevel = 'ADMIN') {
  const requesterRole = await getUserRole(supabase, requesterId);
  const requesterLevel = ROLE_LEVELS[requesterRole] || 0;
  const requiredRoleLevel = ROLE_LEVELS[requiredLevel] || 0;

  // Check if requester has sufficient level
  if (requesterLevel < requiredRoleLevel) {
    return { authorized: false, reason: 'Insufficient permissions' };
  }

  // If there's a target, ensure requester outranks target
  if (targetId) {
    const targetRole = await getUserRole(supabase, targetId);
    const targetLevel = ROLE_LEVELS[targetRole] || 0;
    
    if (requesterLevel <= targetLevel) {
      return { authorized: false, reason: 'Cannot modify user of equal or higher rank' };
    }
  }

  return { authorized: true, role: requesterRole, level: requesterLevel };
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

	const adminClient = createClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
				detectSessionInUrl: false
			},
			global: {
				headers: {
					'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
				}
			}
		}
	);

    const { action, payload } = JSON.parse(event.body);
    let result;

    switch(action) {
	  case 'signUp':
	    result = await supabase.auth.signUp(payload);
	    // Auto-assign USER role
	    if (result.data?.user) {
	  	await adminClient.from('user_roles').insert({
	  	  user_id: result.data.user.id,
	  	  role: 'USER'
	  	});
	    }
	    break;

      case 'signIn':
        result = await supabase.auth.signInWithPassword(payload);
        break;

      case 'signOut':
        result = await supabase.auth.signOut();
        break;

      case 'getSession':
        result = await supabase.auth.getSession();
        break;

      case 'resetPassword':
        result = await supabase.auth.resetPasswordForEmail(payload.email, {
          redirectTo: 'https://www.strainnavigator.com/reset-password.html'
        });
        break;

      case 'adminListUsers':
        const adminSupabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Get requester from session (you'll need to pass this)
        const authHeader = event.headers.authorization;
        if (!authHeader) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'No authorization' })
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: requester }, error: authCheckError } = await supabase.auth.getUser(token);
        
        if (authCheckError || !requester) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Unauthorized' })
          };
        }

        // Check if requester is at least MODERATOR
        const permission = await checkPermission(adminSupabase, requester.id, null, 'MODERATOR');
        if (!permission.authorized) {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ error: permission.reason })
          };
        }

        const { data: authUsers, error: authError } = await adminSupabase.auth.admin.listUsers();
        
        if (authError) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: authError.message })
          };
        }

        const usersWithProfiles = await Promise.all(
          authUsers.users.map(async (authUser) => {
            const { data: profile } = await adminSupabase
              .from('user_profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();

            const { data: roleData } = await adminSupabase
              .from('user_roles')
              .select('role')
              .eq('user_id', authUser.id)
              .single();

            const { count: strainCount } = await adminSupabase
              .from('strains')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', authUser.id);

            return {
              id: authUser.id,
              email: authUser.email,
              created_at: authUser.created_at,
              role: roleData?.role || 'USER',
              ...profile,
              strain_count: strainCount || 0
            };
          })
        );

        result = { data: usersWithProfiles };
        break;

      case 'bulkInsertStrains': {
        const strainsAuthHeader = event.headers.authorization;
        const strainsToken = strainsAuthHeader.replace('Bearer ', '');
        const { data: { user: strainsUser } } = await supabase.auth.getUser(strainsToken);

        const { strains: strainsInput } = payload;

        // Check what already exists
        const { data: existingStrains } = await adminClient
          .from('strains')
          .select('plant_id')
          .eq('user_id', strainsUser.id);

        const existingPlantIds = new Set(existingStrains?.map(s => s.plant_id) || []);

        // Only insert new ones
        const newStrains = (strainsInput || []).filter(s => {
          const plantId = s.plantId || s.individualId;
          return !existingPlantIds.has(plantId);
        });

        if (newStrains.length === 0) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              data: [],
              count: 0,
              message: 'No new strains to migrate - all already exist'
            })
          };
        }

        const strainsWithUser = newStrains.map(s => ({
          strain_name: s.strainName || s.name,
          plant_id: s.plantId || s.individualId,
          type: s.type,
          generation: s.generation,
          status: s.status || 'active',
          date_added: s.dateAdded || s.date_added || new Date().toISOString().split('T')[0],
          sex: s.sex,
          notes: s.notes,
          metadata: {
            imageId: s.imageId,
            traits: s.traits || {},
            isBreeder: s.isBreeder
          },
          user_id: strainsUser.id,
          created_at: new Date().toISOString()
        }));

        const { data: insertedStrains, error: strainsError } = await adminClient
          .from('strains')
          .insert(strainsWithUser)
          .select();

        if (strainsError) {
          console.error('Strain insert error:', strainsError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: strainsError.message, details: strainsError })
          };
        }

        result = {
          data: insertedStrains,
          count: insertedStrains.length,
          skipped: (strainsInput || []).length - newStrains.length
        };
        break;
      }

	  
	  case 'bulkInsertBreedingPairs':
		const pairsAuthHeader = event.headers.authorization;
		const pairsToken = pairsAuthHeader.replace('Bearer ', '');
		const { data: { user: pairsUser } } = await supabase.auth.getUser(pairsToken);
		
		const { pairs } = payload;
		
		// Check what already exists
		const { data: existingPairs } = await adminClient
		.from('breeding_pairs')
		.select('pair_id')
		.eq('user_id', pairsUser.id);
		
		const existingPairIds = new Set(existingPairs?.map(p => p.pair_id) || []);
		
		// Only insert new ones
		const newPairs = pairs.filter(p => !existingPairIds.has(p.id));
		
		if (newPairs.length === 0) {
		return {
		  statusCode: 200,
		  headers,
		  body: JSON.stringify({ 
			data: [], 
			count: 0, 
			message: 'No new pairs to migrate - all already exist' 
		  })
		};
		}
	  
		const pairsWithUser = newPairs.map(p => ({
		pair_id: p.id,
		mother_id: p.motherId || null,
		father_id: p.fatherId || null,
		date_created: p.dateCreated || p.date_created || new Date().toISOString().split('T')[0],
		status: p.status || 'active',
		seeds_produced: p.seedsProduced || 0,
		expected_generation: p.expectedGeneration,
		offspring_strain_name: p.offspringStrainName,
		metadata: {
		  motherStrainName: p.motherStrainName || p.motherName,
		  fatherStrainName: p.fatherStrainName || p.fatherName,
		  motherPlantId: p.motherPlantId,
		  fatherPlantId: p.fatherPlantId,
		  motherId: p.motherId,
		  fatherId: p.fatherId,
		  notes: p.notes
		},
		user_id: pairsUser.id,
		created_at: new Date().toISOString()
		}));
	  
		const { data: insertedPairs, error: pairsError } = await adminClient
		.from('breeding_pairs')
		.insert(pairsWithUser)
		.select();
	  
		if (pairsError) {
		console.error('Pairs insert error:', pairsError);
		return {
		  statusCode: 500,
		  headers,
		  body: JSON.stringify({ error: pairsError.message, details: pairsError })
		};
		}
	  
		result = { 
		data: insertedPairs, 
		count: insertedPairs.length,
		skipped: pairs.length - newPairs.length
		};
		break;

	  case 'updatePassword': {
			if (!token) {
				return {
					statusCode: 401,
					headers,
					body: JSON.stringify({ error: { message: 'Unauthorized' } })
				};
			}

			const { password } = payload;
			const { data, error } = await supabase.auth.admin.updateUserById(
				token,
				{ password }
			);

			if (error) {
				return {
					statusCode: 400,
					headers,
					body: JSON.stringify({ error: { message: error.message } })
				};
			}

			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({ data })
			};
	  }

      case 'useAccessToken': {
        // Frontend sends Authorization: Bearer <access_token from URL hash>
        const authHeader = event.headers.authorization || '';
        if (!authHeader.startsWith('Bearer ')) {
          return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization' }) };
        }
        const token = authHeader.replace('Bearer ', '');

        // Verify token, fetch user
        const { data: { user }, error: whoErr } = await supabase.auth.getUser(token);
        if (whoErr || !user) {
          return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
        }

        // Also return role for convenience
        const { data: roleRow } = await adminClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        result = {
          data: {
            user,
            session: { access_token: token },
            role: roleRow?.role || 'USER'
          }
        };
        break;
      }

	  case 'getAllUserData': {
		const getAllAuthHeader = event.headers.authorization;
		const getAllToken = getAllAuthHeader.replace('Bearer ', '');
		const { data: { user: getAllUser } } = await supabase.auth.getUser(getAllToken);

		const { data: userStrains } = await adminClient
		.from('strains')
		.select('*')
		.eq('user_id', getAllUser.id)
		.or('deleted.is.null,deleted.eq.false');

		const { data: userBreedingPairs } = await adminClient
		.from('breeding_pairs')
		.select('*')
		.eq('user_id', getAllUser.id);

		const { data: userSeedBatches } = await adminClient
		.from('seed_batches')
		.select('*')
		.eq('user_id', getAllUser.id);

		const { data: userTestGrows } = await adminClient
		.from('test_grows')
		.select('*')
		.eq('user_id', getAllUser.id);

		const { data: userTraitObservations } = await adminClient
		.from('trait_observations')
		.select('*')
		.eq('user_id', getAllUser.id);

		const { data: profile } = await adminClient
		.from('user_profiles')
		.select('metadata')
		.eq('id', getAllUser.id)
		.single();

		result = {
		data: {
		  strains: userStrains || [],
		  breedingPairs: userBreedingPairs || [],
		  seedBatches: userSeedBatches || [],
		  testGrows: userTestGrows || [],
		  traitObservations: userTraitObservations || [],
		  settings: profile?.metadata || {}
		}
		};
		break;
	  }

	  case 'deleteTraitObservation':
		const deleteTraitAuthHeader = event.headers.authorization;
		const deleteTraitToken = deleteTraitAuthHeader.replace('Bearer ', '');
		const { data: { user: deleteTraitUser } } = await supabase.auth.getUser(deleteTraitToken);
		
		const { observationId } = payload;
		
		// Verify ownership before deleting
		const { data: observationToDelete } = await adminClient
			.from('trait_observations')
			.select('user_id')
			.eq('id', observationId)
			.single();
		
		if (!observationToDelete || observationToDelete.user_id !== deleteTraitUser.id) {
			return {
				statusCode: 403,
				headers,
				body: JSON.stringify({ error: 'Not authorized to delete this observation' })
			};
		}
		
		// Delete from database
		const { error: deleteTraitError } = await adminClient
			.from('trait_observations')
			.delete()
			.eq('id', observationId);
		
		if (deleteTraitError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: deleteTraitError.message })
			};
		}
		
		result = { success: true };
		break;

	  case 'deleteTestGrow':
		const deleteTestAuthHeader = event.headers.authorization;
		const deleteTestToken = deleteTestAuthHeader.replace('Bearer ', '');
		const { data: { user: deleteTestUser } } = await supabase.auth.getUser(deleteTestToken);

		const { testGrowId } = payload;

		const { error: deleteTestError } = await adminClient
			.from('test_grows')
			.delete()
			.eq('id', testGrowId)
			.eq('user_id', deleteTestUser.id);

		if (deleteTestError) throw deleteTestError;

		result = { success: true };
		break;

	  case 'deleteBreedingPair':
		const deletePairAuthHeader = event.headers.authorization;
		const deletePairToken = deletePairAuthHeader.replace('Bearer ', '');
		const { data: { user: deletePairUser } } = await supabase.auth.getUser(deletePairToken);

		const { id: pairId } = payload;

		const { error: deletePairError } = await adminClient
			.from('breeding_pairs')
			.delete()
			.eq('id', pairId)
			.eq('user_id', deletePairUser.id);

		if (deletePairError) throw deletePairError;

		result = { success: true };
		break;

	  case 'saveUserData':
		const saveAuthHeader = event.headers.authorization;
		const saveToken = saveAuthHeader.replace('Bearer ', '');
		const { data: { user: saveUser } } = await supabase.auth.getUser(saveToken);
	  
		const { strains: strainsPayload, breedingPairs, seedBatches, testGrows, traitObservations, settings } = payload;
		
		// UPSERT strains (no deleting)
		if (strainsPayload && strainsPayload.length > 0) {
			const strainsToSave = strainsPayload.map(s => ({
				id: s.id, // Use the frontend ID as primary key
				strain_name: s.strainName || s.name,
				plant_id: s.plantId || s.individualId,
				type: s.type,
				generation: s.generation,
				status: s.status || 'active',
				date_added: s.dateAdded || s.date_added || new Date().toISOString().split('T')[0],
				sex: s.sex,
				notes: s.notes,
				parent_mother_id: s.parentMother,
				parent_father_id: s.parentFather,
				deleted: s.deleted || false,
				label_url: s.labelUrl,
				label_id: s.labelId,
				metadata: {
					imageId: s.imageId,
					imageUrl: s.imageUrl,
					traits: s.traits || {},
					isBreeder: s.isBreeder
				},
				user_id: saveUser.id
			}));
			
			const { error: strainsError } = await adminClient.from('strains').upsert(strainsToSave, { onConflict: 'id' });

			if (strainsError) {
				console.error('Strains upsert error:', strainsError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: 'Failed to save strains: ' + strainsError.message })
				};
			}
		}
		
		// Declare pairIdMap outside so it's accessible to seed batches
		let pairIdMap = new Map();

		// UPSERT breeding pairs (no deleting)
		if (breedingPairs && breedingPairs.length > 0) {
			// Get all valid strain IDs from database to validate foreign keys
			const { data: existingStrains } = await adminClient
				.from('strains')
				.select('id')
				.eq('user_id', saveUser.id);

			const validStrainIds = new Set((existingStrains || []).map(s => s.id));
			console.log('Valid strain IDs from database:', validStrainIds.size, 'IDs');

			// Separate new pairs from existing pairs
			const newPairs = [];
			const existingPairs = [];

			breedingPairs.forEach(p => {
				console.log('Saving pair:', p.id, 'dbId:', p.dbId, 'motherId:', p.motherId, 'fatherId:', p.fatherId);

				// Only set mother_id/father_id if they reference valid strains that exist
				const motherId = (p.motherId && validStrainIds.has(p.motherId)) ? p.motherId : null;
				const fatherId = (p.fatherId && validStrainIds.has(p.fatherId)) ? p.fatherId : null;

				console.log('Valid strain IDs check - motherId:', motherId, 'fatherId:', fatherId, 'validStrainIds size:', validStrainIds.size);

				const pairData = {
					pair_id: p.id,
					mother_id: motherId,
					father_id: fatherId,
					date_created: p.dateCreated || p.date_created || new Date().toISOString().split('T')[0],
					status: p.status || 'active',
					seeds_produced: p.seedsProduced || 0,
					expected_generation: p.expectedGeneration,
					offspring_strain_name: p.offspringStrainName,
					metadata: {
						pairDisplayName: p.pairDisplayName,
						motherStrainName: p.motherStrainName || p.motherName,
						fatherStrainName: p.fatherStrainName || p.fatherName,
						motherPlantId: p.motherPlantId,
						fatherPlantId: p.fatherPlantId,
						motherId: p.motherId,
						fatherId: p.fatherId,
						notes: p.notes
					},
					user_id: saveUser.id
				};

				if (p.dbId) {
					// Existing pair - include database id for update
					pairData.id = p.dbId;
					existingPairs.push(pairData);
				} else {
					// New pair - no database id yet
					newPairs.push(pairData);
				}
			});

			let allPairs = [];

			// Insert new pairs
			if (newPairs.length > 0) {
				const { data: insertedNewPairs, error: insertError } = await adminClient
					.from('breeding_pairs')
					.insert(newPairs)
					.select('id, pair_id');

				if (insertError) {
					console.error('Pairs insert error:', insertError);
					return {
						statusCode: 500,
						headers,
						body: JSON.stringify({ error: 'Failed to insert breeding pairs: ' + insertError.message })
					};
				}
				allPairs = allPairs.concat(insertedNewPairs || []);
			}

			// Update existing pairs
			if (existingPairs.length > 0) {
				const { data: updatedPairs, error: updateError } = await adminClient
					.from('breeding_pairs')
					.upsert(existingPairs, { onConflict: 'id' })
					.select('id, pair_id');

				if (updateError) {
					console.error('Pairs update error:', updateError);
					return {
						statusCode: 500,
						headers,
						body: JSON.stringify({ error: 'Failed to update breeding pairs: ' + updateError.message })
					};
				}
				allPairs = allPairs.concat(updatedPairs || []);
			}

			// Map frontend pair_id to database id for foreign key relationships
			pairIdMap = new Map(allPairs.map(p => [p.pair_id, p.id]));
			console.log('Pair ID mapping:', Array.from(pairIdMap.entries()));
		}

		// UPSERT seed batches (no deleting)
		if (seedBatches && seedBatches.length > 0) {
			const batchesToSave = seedBatches.map(b => {
				const dbPairId = pairIdMap.get(b.breedingPairId);
				console.log(`Mapping batch ${b.batchId}: frontend pair ${b.breedingPairId} -> db pair ${dbPairId}`);
				return {
					id: b.id,
					batch_id: b.batchId,
					breeding_pair_id: dbPairId || null,
					seed_count: b.seedCount || 0,
					harvest_date: b.harvestDate || new Date().toISOString().split('T')[0],
					germination_tests: b.germinationTests || [],
					status: b.status || 'stored',
					expected_generation: b.expectedGeneration,
					metadata: {
						motherName: b.motherName,
						fatherName: b.fatherName,
						offspringStrainName: b.offspringStrainName,
						notes: b.notes
					},
					user_id: saveUser.id
				};
			});
			
			console.log('Batches to save:', batchesToSave.map(b => ({ 
				batch_id: b.batch_id, 
				breeding_pair_id: b.breeding_pair_id 
			})));
			
			const { error: batchesError } = await adminClient.from('seed_batches').upsert(batchesToSave, { onConflict: 'id' });
			
			if (batchesError) {
				console.error('Seed batches upsert error:', batchesError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: 'Failed to save seed batches: ' + batchesError.message })
				};
			}
		}
		
		// UPSERT test grows (no deleting)
		if (testGrows && testGrows.length > 0) {
			const testsToSave = testGrows.map(t => ({
				id: t.id,
				test_id: t.testId,
				seed_batch_id: t.seedBatchId,
				plant_count: t.plantCount || 0,
				start_date: t.startDate || new Date().toISOString().split('T')[0],
				environment: t.environment,
				purpose: t.purpose,
				status: t.status || 'active',
				metadata: {
					batchName: t.batchName,
					genetics: t.genetics,
					plants: t.plants || [],
					observations: t.observations || [],
					harvestData: t.harvestData
				},
				user_id: saveUser.id
			}));
			
			const { error: testGrowsError } = await adminClient.from('test_grows').upsert(testsToSave, { onConflict: 'id' });

			if (testGrowsError) {
				console.error('Test grows upsert error:', testGrowsError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: 'Failed to save test grows: ' + testGrowsError.message })
				};
			}
		}
		
		// UPSERT trait observations (no deleting)
		if (traitObservations && traitObservations.length > 0) {
			const traitsToSave = traitObservations.map(o => ({
				id: o.id,
				subject_id: o.subjectId,
				subject_type: o.subjectType,
				category: o.category,
				trait_name: o.traitName,
				value: o.value,
				observation_date: o.date || new Date().toISOString().split('T')[0],
				metadata: {
					notes: o.notes,
					dateRecorded: o.dateRecorded
				},
				user_id: saveUser.id
			}));
			
			const { error: traitsError } = await adminClient.from('trait_observations').upsert(traitsToSave, { onConflict: 'id' });

			if (traitsError) {
				console.error('Trait observations upsert error:', traitsError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: 'Failed to save trait observations: ' + traitsError.message })
				};
			}
		}
		
		// UPSERT settings
		if (settings) {
			const { error: settingsError } = await adminClient
				.from('user_profiles')
				.upsert({
					id: saveUser.id,
					metadata: settings,
					updated_at: new Date().toISOString()
				}, { onConflict: 'id' });
			
			if (settingsError) {
				console.error('Settings upsert error:', settingsError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: 'Failed to save settings: ' + settingsError.message })
				};
			}
		}
	  
		result = { success: true };
		break;

	  case 'bulkInsertSeedBatches':
		const batchesAuthHeader = event.headers.authorization;
		const batchesToken = batchesAuthHeader.replace('Bearer ', '');
		const { data: { user: batchesUser } } = await supabase.auth.getUser(batchesToken);
	  
		const { batches } = payload;
		
		const batchesWithUser = batches.map(b => ({
		batch_id: b.batchId,
		seed_count: b.seedCount || 0,
		harvest_date: b.harvestDate || new Date().toISOString().split('T')[0],
		germination_tests: b.germinationTests || [],
		status: b.status || 'stored',
		expected_generation: b.expectedGeneration,
		metadata: {
		  motherName: b.motherName,
		  fatherName: b.fatherName,
		  notes: b.notes
		},
		user_id: batchesUser.id,
		created_at: new Date().toISOString()
		}));
	  
		const { data: insertedBatches, error: batchesError } = await adminClient
		.from('seed_batches')
		.insert(batchesWithUser)
		.select();
	  
		if (batchesError) {
		console.error('Batches insert error:', batchesError);
		return {
		  statusCode: 500,
		  headers,
		  body: JSON.stringify({ error: batchesError.message })
		};
		}
	  
		result = { data: insertedBatches, count: insertedBatches.length };
		break;
	  
	  case 'bulkInsertTestGrows':
		const testsAuthHeader = event.headers.authorization;
		const testsToken = testsAuthHeader.replace('Bearer ', '');
		const { data: { user: testsUser } } = await supabase.auth.getUser(testsToken);
	  
		const { testGrows: testGrowsData } = payload;  // ← CHANGED THIS LINE
		
		const testsWithUser = testGrowsData.map(t => ({  // ← CHANGED THIS LINE
		test_id: t.testId,
		plant_count: t.plantCount || 0,
		start_date: t.startDate || new Date().toISOString().split('T')[0],
		environment: t.environment,
		purpose: t.purpose,
		status: t.status || 'active',
		metadata: {
		  batchName: t.batchName,
		  genetics: t.genetics,
		  plants: t.plants || [],
		  observations: t.observations || [],
		  harvestData: t.harvestData
		},
		user_id: testsUser.id,
		created_at: new Date().toISOString()
		}));
	  
		const { data: insertedTests, error: testsError } = await adminClient
		.from('test_grows')
		.insert(testsWithUser)
		.select();
	  
		if (testsError) {
		console.error('Tests insert error:', testsError);
		return {
		  statusCode: 500,
		  headers,
		  body: JSON.stringify({ error: testsError.message })
		};
		}
	  
		result = { data: insertedTests, count: insertedTests.length };
		break;
	  
	  case 'bulkInsertTraitObservations':
		const traitsAuthHeader = event.headers.authorization;
		const traitsToken = traitsAuthHeader.replace('Bearer ', '');
		const { data: { user: traitsUser } } = await supabase.auth.getUser(traitsToken);
	  
		const { observations } = payload;
		
		const traitsWithUser = observations.map(o => ({
		subject_id: o.subjectId,
		subject_type: o.subjectType,
		category: o.category,
		trait_name: o.traitName,
		value: o.value,
		observation_date: o.date || new Date().toISOString().split('T')[0],
		metadata: {
		  notes: o.notes,
		  dateRecorded: o.dateRecorded
		},
		user_id: traitsUser.id,
		created_at: new Date().toISOString()
		}));
	  
		const { data: insertedTraits, error: traitsError } = await adminClient
		.from('trait_observations')
		.insert(traitsWithUser)
		.select();
	  
		if (traitsError) {
		console.error('Traits insert error:', traitsError);
		return {
		  statusCode: 500,
		  headers,
		  body: JSON.stringify({ error: traitsError.message })
		};
		}
	  
		result = { data: insertedTraits, count: insertedTraits.length };
		break;
	  
	  case 'setDisplayName':
		const setNameAuthHeader = event.headers.authorization;
		const setNameToken = setNameAuthHeader.replace('Bearer ', '');
		const { data: { user: setNameUser } } = await supabase.auth.getUser(setNameToken);
	  
		const { display_name } = payload;
	  
		if (!display_name || !/^[A-Za-z0-9 ._-]{3,24}$/.test(display_name)) {
		return {
		  statusCode: 400,
		  headers,
		  body: JSON.stringify({ error: 'Invalid display name format' })
		};
		}
	  
		const { data: updatedProfile, error: setNameError } = await adminClient
		.from('user_profiles')
		.upsert({
		  id: setNameUser.id,
		  display_name: display_name,
		  updated_at: new Date().toISOString()
		}, { onConflict: 'id' })
		.select()
		.single();
	  
		if (setNameError) {
		return {
		  statusCode: 500,
		  headers,
		  body: JSON.stringify({ error: setNameError.message })
		};
		}
	  
		result = { data: updatedProfile };
		break;

	  case 'adminGetStats':
		const statsAuthHeader = event.headers.authorization;
		if (!statsAuthHeader) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'No authorization' })
		  };
		}

		const statsToken = statsAuthHeader.replace('Bearer ', '');
		const { data: { user: statsRequester } } = await supabase.auth.getUser(statsToken);
		
		if (!statsRequester) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'Unauthorized' })
		  };
		}

		const statsPermission = await checkPermission(adminClient, statsRequester.id, null, 'MODERATOR');
		if (!statsPermission.authorized) {
		  return {
			statusCode: 403,
			headers,
			body: JSON.stringify({ error: statsPermission.reason })
		  };
		}

		const { data: allAuthUsers } = await adminClient.auth.admin.listUsers();
		
		const { count: publicProfilesCount } = await adminClient
		  .from('user_profiles')
		  .select('*', { count: 'exact', head: true })
		  .eq('is_public', true);

		const { count: totalStrainsCount } = await adminClient
		  .from('strains')
		  .select('*', { count: 'exact', head: true });

		const { count: totalPairsCount } = await adminClient
		  .from('breeding_pairs')
		  .select('*', { count: 'exact', head: true });

		result = {
		  data: {
			totalUsers: allAuthUsers?.users?.length || 0,
			publicProfiles: publicProfilesCount || 0,
			totalStrains: totalStrainsCount || 0,
			totalPairs: totalPairsCount || 0
		  }
		};
		break;

	  case 'adminDeleteUser':
		const deleteAuthHeader = event.headers.authorization;
		if (!deleteAuthHeader) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'No authorization' })
		  };
		}

		const deleteToken = deleteAuthHeader.replace('Bearer ', '');
		const { data: { user: deleteRequester } } = await supabase.auth.getUser(deleteToken);
		
		if (!deleteRequester) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'Unauthorized' })
		  };
		}

		const { userId } = payload;

		if (!userId) {
		  return {
			statusCode: 400,
			headers,
			body: JSON.stringify({ error: 'userId required' })
		  };
		}

		// Check permission - requires ADMIN and must outrank target
		const deletePermission = await checkPermission(adminClient, deleteRequester.id, userId, 'ADMIN');
		if (!deletePermission.authorized) {
		  return {
			statusCode: 403,
			headers,
			body: JSON.stringify({ error: deletePermission.reason })
		  };
		}

		await adminClient.from('strains').delete().eq('user_id', userId);
		await adminClient.from('breeding_pairs').delete().eq('user_id', userId);
		await adminClient.from('seed_batches').delete().eq('user_id', userId);
		await adminClient.from('test_grows').delete().eq('user_id', userId);
		await adminClient.from('trait_observations').delete().eq('user_id', userId);
		await adminClient.from('user_profiles').delete().eq('id', userId);
		await adminClient.from('user_roles').delete().eq('user_id', userId);

		const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

		if (deleteError) {
		  return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: deleteError.message })
		  };
		}

		result = { success: true };
		break;

	  case 'adminPromoteUser':
		const promoteAuthHeader = event.headers.authorization;
		const promoteToken = promoteAuthHeader.replace('Bearer ', '');
		const { data: { user: promoteRequester } } = await supabase.auth.getUser(promoteToken);
		
		const { targetUserId, newRole } = payload;

		// Only OWNER can promote to ADMIN, only ADMIN+ can promote to MODERATOR
		const requiredLevel = newRole === 'ADMIN' ? 'OWNER' : 'ADMIN';
		const promotePermission = await checkPermission(adminClient, promoteRequester.id, targetUserId, requiredLevel);
		
		if (!promotePermission.authorized) {
		  return {
			statusCode: 403,
			headers,
			body: JSON.stringify({ error: promotePermission.reason })
		  };
		}

		// Can't promote to OWNER
		if (newRole === 'OWNER') {
		  return {
			statusCode: 403,
			headers,
			body: JSON.stringify({ error: 'Cannot promote to OWNER' })
		  };
		}

		const { error: updateError } = await adminClient
		  .from('user_roles')
		  .update({ 
			role: newRole,
			granted_by: promoteRequester.id,
			granted_at: new Date().toISOString()
		  })
		  .eq('user_id', targetUserId);

		if (updateError) {
		  return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: updateError.message })
		  };
		}

		result = { success: true };
		break;

	  case 'grantBadge':
		const grantBadgeAuthHeader = event.headers.authorization;
		if (!grantBadgeAuthHeader) {
			return {
				statusCode: 401,
				headers,
				body: JSON.stringify({ error: 'No authorization' })
			};
		}

		const grantBadgeToken = grantBadgeAuthHeader.replace('Bearer ', '');
		const { data: { user: badgeGranter }, error: granterAuthError } = await supabase.auth.getUser(grantBadgeToken);
		
		if (granterAuthError || !badgeGranter) {
			return {
				statusCode: 401,
				headers,
				body: JSON.stringify({ error: 'Unauthorized' })
			};
		}
		
		const badgePermission = await checkPermission(adminClient, badgeGranter.id, null, 'ADMIN');
		if (!badgePermission.authorized) {
			return {
				statusCode: 403,
				headers,
				body: JSON.stringify({ error: 'Admin access required' })
			};
		}

		const grantTargetUserId = payload.targetUserId;
		const grantBadgeType = payload.badgeType;
		const grantNotes = payload.notes;

		const { error: badgeError } = await adminClient
			.from('user_badges')
			.insert({
				user_id: grantTargetUserId,
				badge_type: grantBadgeType,
				granted_by: badgeGranter.id,
				notes: grantNotes || null
			});

		if (badgeError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: badgeError.message })
			};
		}

		result = { success: true };
		break;

	  case 'revokeBadge':
		const revokeBadgeAuthHeader = event.headers.authorization;
		if (!revokeBadgeAuthHeader) {
			return {
				statusCode: 401,
				headers,
				body: JSON.stringify({ error: 'No authorization' })
			};
		}

		const revokeBadgeToken = revokeBadgeAuthHeader.replace('Bearer ', '');
		const { data: { user: badgeRevoker }, error: revokerAuthError } = await supabase.auth.getUser(revokeBadgeToken);
		
		if (revokerAuthError || !badgeRevoker) {
			return {
				statusCode: 401,
				headers,
				body: JSON.stringify({ error: 'Unauthorized' })
			};
		}
		
		const revokePermission = await checkPermission(adminClient, badgeRevoker.id, null, 'ADMIN');
		if (!revokePermission.authorized) {
			return {
				statusCode: 403,
				headers,
				body: JSON.stringify({ error: 'Admin access required' })
			};
		}

		const revokeBadgeId = payload.badgeId;

		const { error: revokeError } = await adminClient
			.from('user_badges')
			.delete()
			.eq('id', revokeBadgeId);

		if (revokeError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: revokeError.message })
			};
		}

		result = { success: true };
		break;
		
	  case 'getUserBadges':
		const getBadgesAuthHeader = event.headers.authorization;
		if (!getBadgesAuthHeader) {
			return {
				statusCode: 401,
				headers,
				body: JSON.stringify({ error: 'No authorization' })
			};
		}

		const getBadgesToken = getBadgesAuthHeader.replace('Bearer ', '');
		const { data: { user: badgeRequester }, error: badgeRequesterAuthError } = await supabase.auth.getUser(getBadgesToken);
		
		if (badgeRequesterAuthError || !badgeRequester) {
			return {
				statusCode: 401,
				headers,
				body: JSON.stringify({ error: 'Unauthorized' })
			};
		}

		const getBadgesUserId = payload.userId;

		const { data: userBadges, error: getUserBadgesError } = await adminClient
			.from('user_badges')
			.select('*')
			.eq('user_id', getBadgesUserId)
			.order('granted_at', { ascending: false });

		if (getUserBadgesError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: getUserBadgesError.message })
			};
		}

		result = { data: userBadges || [] };
		break;	

	  case 'updateProfile':
		const updateAuthHeader = event.headers.authorization;
		if (!updateAuthHeader) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'No authorization' })
		  };
		}

		const updateToken = updateAuthHeader.replace('Bearer ', '');
		const { data: { user: updateUser }, error: updateAuthError } = await supabase.auth.getUser(updateToken);
		
		if (updateAuthError || !updateUser) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'Unauthorized' })
		  };
		}

		const { profile } = payload;

		// First check if profile exists
		const { data: existingProfile } = await adminClient
			.from('user_profiles')
			.select('id')
			.eq('id', updateUser.id)
			.single();

		let profileData, profileError;

		if (existingProfile) {
			// Update existing
			const updateResult = await adminClient
				.from('user_profiles')
				.update({
					...profile,
					updated_at: new Date().toISOString()
				})
				.eq('id', updateUser.id)
				.select()
				.single();
			
			profileData = updateResult.data;
			profileError = updateResult.error;
		} else {
			// Insert new
			const insertResult = await adminClient
				.from('user_profiles')
				.insert({
					id: updateUser.id,
					...profile,
					updated_at: new Date().toISOString()
				})
				.select()
				.single();
			
			profileData = insertResult.data;
			profileError = insertResult.error;
		}

		if (profileError) {
			console.error('Profile save error:', profileError);
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: profileError.message, details: profileError })
			};
		}

		result = { data: profileData };
		break;

	  case 'getProfile':
		const getAuthHeader = event.headers.authorization;
		if (!getAuthHeader) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'No authorization' })
		  };
		}

		const getToken = getAuthHeader.replace('Bearer ', '');
		const { data: { user: getUser }, error: getAuthError } = await supabase.auth.getUser(getToken);
		
		if (getAuthError || !getUser) {
		  return {
			statusCode: 401,
			headers,
			body: JSON.stringify({ error: 'Unauthorized' })
		  };
		}

		const { data: getUserProfile, error: getProfileError } = await adminClient
			.from('user_profiles')
			.select('*')
			.eq('id', getUser.id)
			.single();

		if (getProfileError && getProfileError.code !== 'PGRST116') {
			console.error('Get profile error:', getProfileError);
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: getProfileError.message })
			};
		}

		result = { data: getUserProfile || {} };
		break;

	  case 'adminUpdateUserProfile':
		const adminUpdateAuthHeader = event.headers.authorization;
		const adminUpdateToken = adminUpdateAuthHeader.replace('Bearer ', '');
		const { data: { user: adminUpdateRequester } } = await supabase.auth.getUser(adminUpdateToken);
		
		const { userId: adminTargetUserId, updates } = payload;
		
		const adminUpdatePermission = await checkPermission(adminClient, adminUpdateRequester.id, adminTargetUserId, 'ADMIN');
		if (!adminUpdatePermission.authorized) {
			return {
				statusCode: 403,
				headers,
				body: JSON.stringify({ error: adminUpdatePermission.reason })
			};
		}
		
		const { error: adminUpdateError } = await adminClient
			.from('user_profiles')
			.update({
				...updates,
				updated_at: new Date().toISOString()
			})
			.eq('id', adminTargetUserId);
		
		if (adminUpdateError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: adminUpdateError.message })
			};
		}
		
		result = { success: true };
		break;

	  case 'appendIceCandidates': {
		const { session_id, from, candidates } = payload;
		
		// Determine which column to update
		const iceColumn = from === 'host' ? 'host_ice' : 'guest_ice';
		
		// Get existing ICE candidates
		const { data: session } = await supabase
			.from('video_sessions')
			.select(iceColumn)
			.eq('id', session_id)
			.single();
		
		// Append new candidates to existing ones
		const existingIce = session?.[iceColumn] || [];
		const updatedIce = [...existingIce, ...candidates];
		
		// Update the session
		const { data, error } = await supabase
			.from('video_sessions')
			.update({ [iceColumn]: updatedIce })
			.eq('id', session_id)
			.select()
			.single();
		
		if (error) throw error;
		return { data };
	  }

	  case 'getCommunityListings': {
	    // Optional auth: public feed if no token; public+own if token is valid
	    const authHeader = event.headers.authorization || '';
	    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
	    let requester = null;
	  
	    if (token) {
	  	const { data: gotUser, error: getUserErr } = await supabase.auth.getUser(token);
	  	if (!getUserErr && gotUser?.user) {
	  	  requester = gotUser.user;
	  	}
	    }
	  
	    // Use service role to read profiles display_name safely under RLS
	    const db = createClient(
	  	process.env.SUPABASE_URL,
	  	process.env.SUPABASE_SERVICE_ROLE_KEY
	    );
	  
	    const { search = '', limit = 24, offset = 0 } = (payload || {});
	    const like = `%${search}%`;
	  
	    let query = db
	  	.from('community_listings')
	  	.select('*')
	  	.order('created_at', { ascending: false })
	  	.range(offset, offset + Math.max(1, Math.min(100, limit)) - 1);
	  
	    if (search && search.trim() !== '') {
	  	query = query.or(`title.ilike.${like},tagline.ilike.${like}`);
	    }
	  
	    if (requester?.id) {
	  	// Public OR owned by requester
	  	query = query.or(`is_public.eq.true,user_id.eq.${requester.id}`);
	    } else {
	  	// Public only
	  	query = query.eq('is_public', true);
	    }
	  
	    const { data: listings, error: listErr } = await query;
	  
	    if (listErr) {
	  	return {
	  	  statusCode: 500,
	  	  headers,
	  	  body: JSON.stringify({ error: listErr.message })
	  	};
	    }
	  
	    if (!listings || listings.length === 0) {
	  	result = { data: [] };
	  	break;
	    }
	  
	    // Batch fetch display names for unique user_ids
	    const userIds = [...new Set(listings.map(l => l.user_id).filter(Boolean))];
	    const { data: profiles, error: profErr } = await db
	  	.from('user_profiles')
	  	.select('id, display_name')
	  	.in('id', userIds);
	  
	    if (profErr) {
	  	return {
	  	  statusCode: 500,
	  	  headers,
	  	  body: JSON.stringify({ error: profErr.message })
	  	};
	    }
	  
	    const nameById = new Map((profiles || []).map(p => [p.id, p.display_name || null]));
	    const decorated = listings.map(l => ({
	  	...l,
	  	display_name: nameById.get(l.user_id) || null
	    }));
	  
	    result = { data: decorated };
	    break;
	  }
	  
	  case 'createCommunityListing': {
	    const authHeader = event.headers.authorization || '';
	    if (!authHeader) {
	  	return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization' }) };
	    }
	    const token = authHeader.replace('Bearer ', '');
	    const { data: { user }, error: getUserErr } = await supabase.auth.getUser(token);
	    if (getUserErr || !user) {
	  	return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
	    }
	  
	    const {
	  	title,
	  	image_url,
	  	tagline = null,
	  	instagram = null,
	  	twitter = null,
	  	discord = null,
	  	is_public = true
	    } = payload || {};
	  
	    if (!title || !image_url) {
	  	return { statusCode: 400, headers, body: JSON.stringify({ error: 'title and image_url are required' }) };
	    }
	  
	    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
	  
	    const { data: inserted, error: insErr } = await db
	  	.from('community_listings')
	  	.insert({
	  	  user_id: user.id,
	  	  title,
	  	  image_url,
	  	  tagline,
	  	  instagram,
	  	  twitter,
	  	  discord,
	  	  is_public: !!is_public
	  	})
	  	.select()
	  	.single();
	  
	    if (insErr) {
	  	return { statusCode: 500, headers, body: JSON.stringify({ error: insErr.message }) };
	    }
	  
	    result = { data: inserted };
	    break;
	  }
	  
	  case 'updateCommunityListing': {
	    const authHeader = event.headers.authorization || '';
	    if (!authHeader) {
	  	return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization' }) };
	    }
	    const token = authHeader.replace('Bearer ', '');
	    const { data: { user }, error: getUserErr } = await supabase.auth.getUser(token);
	    if (getUserErr || !user) {
	  	return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
	    }
	  
	    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
	  
	    const { id: listingId, ...updates } = payload || {};
	    if (!listingId) {
	  	return { statusCode: 400, headers, body: JSON.stringify({ error: 'listing id required' }) };
	    }
	  
	    const { data: existing, error: fetchErr } = await db
	  	.from('community_listings')
	  	.select('user_id')
	  	.eq('id', listingId)
	  	.single();
	  
	    if (fetchErr || !existing) {
	  	return { statusCode: 404, headers, body: JSON.stringify({ error: 'Listing not found' }) };
	    }
	  
	    // Role check (owner or moderator+)
	    const { data: roleRow } = await db
	  	.from('user_roles')
	  	.select('role')
	  	.eq('user_id', user.id)
	  	.single();
	  
	    const role = roleRow?.role || 'USER';
	    const canModerate = ['OWNER', 'ADMIN', 'MODERATOR'].includes(role);
	    const isOwner = existing.user_id === user.id;
	  
	    if (!isOwner && !canModerate) {
	  	return { statusCode: 403, headers, body: JSON.stringify({ error: 'Not authorized to edit this listing' }) };
	    }
	  
	    // Only allow known columns to be updated
	    const allowed = {};
	    if (typeof updates.title === 'string') allowed.title = updates.title;
	    if (typeof updates.image_url === 'string') allowed.image_url = updates.image_url;
	    if (typeof updates.tagline !== 'undefined') allowed.tagline = updates.tagline;
	    if (typeof updates.instagram !== 'undefined') allowed.instagram = updates.instagram;
	    if (typeof updates.twitter !== 'undefined') allowed.twitter = updates.twitter;
	    if (typeof updates.discord !== 'undefined') allowed.discord = updates.discord;
	    if (typeof updates.is_public !== 'undefined') allowed.is_public = !!updates.is_public;
	  
	    const { error: updErr } = await db
	  	.from('community_listings')
	  	.update({
	  	  ...allowed,
	  	  updated_at: new Date().toISOString()
	  	})
	  	.eq('id', listingId);
	  
	    if (updErr) {
	  	return { statusCode: 500, headers, body: JSON.stringify({ error: updErr.message }) };
	    }
	  
	    result = { success: true };
	    break;
	  }
	  
	  case 'deleteCommunityListing': {
	    const authHeader = event.headers.authorization || '';
	    if (!authHeader) {
	  	return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization' }) };
	    }
	    const token = authHeader.replace('Bearer ', '');
	    const { data: { user }, error: getUserErr } = await supabase.auth.getUser(token);
	    if (getUserErr || !user) {
	  	return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
	    }
	  
	    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
	  
	    const { id: listingId } = payload || {};
	    if (!listingId) {
	  	return { statusCode: 400, headers, body: JSON.stringify({ error: 'listing id required' }) };
	    }
	  
	    const { data: existing, error: fetchErr } = await db
	  	.from('community_listings')
	  	.select('user_id')
	  	.eq('id', listingId)
	  	.single();
	  
	    if (fetchErr || !existing) {
	  	return { statusCode: 404, headers, body: JSON.stringify({ error: 'Listing not found' }) };
	    }
	  
	    const { data: roleRow } = await db
	  	.from('user_roles')
	  	.select('role')
	  	.eq('user_id', user.id)
	  	.single();
	  
	    const role = roleRow?.role || 'USER';
	    const canModerate = ['OWNER', 'ADMIN', 'MODERATOR'].includes(role);
	    const isOwner = existing.user_id === user.id;
	  
	    if (!isOwner && !canModerate) {
	  	return { statusCode: 403, headers, body: JSON.stringify({ error: 'Not authorized to delete this listing' }) };
	    }
	  
	    const { error: delErr } = await db
	  	.from('community_listings')
	  	.delete()
	  	.eq('id', listingId);
	  
	    if (delErr) {
	  	return { statusCode: 500, headers, body: JSON.stringify({ error: delErr.message }) };
	    }
	  
	    result = { success: true };
	    break;
	  }


	  case 'submitGalleryMedia':
		const submitAuthHeader = event.headers.authorization;
		const submitToken = submitAuthHeader.replace('Bearer ', '');
		const { data: { user: submitUser } } = await supabase.auth.getUser(submitToken);

		const { data: newMedia, error: submitError } = await adminClient
			.from('user_grow_media')
			.insert({
				user_id: submitUser.id,
				...payload
			})
			.select()
			.single();

		if (submitError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: submitError.message })
			};
		}

		result = { data: newMedia };
		break;

	  case 'getGalleryMedia':
		const getGalleryAuthHeader = event.headers.authorization;
		const getGalleryToken = getGalleryAuthHeader.replace('Bearer ', '');
		const { data: { user: getGalleryUser } } = await supabase.auth.getUser(getGalleryToken);

		const { data: mediaData, error: getMediaError } = await adminClient
			.from('user_grow_media')
			.select('*')
			.eq('is_public', true)
			.order('created_at', { ascending: false });

		// Get user display names and emails
		if (mediaData) {
			for (let item of mediaData) {
				// Get display name from user_profiles
				const { data: profileData } = await adminClient
					.from('user_profiles')
					.select('display_name')
					.eq('id', item.user_id)
					.single();
				
				// Fallback to email username if no display name
				if (!profileData?.display_name) {
					const { data: userData } = await adminClient.auth.admin.getUserById(item.user_id);
					item.display_name = userData?.user?.email?.split('@')[0] || 'Anonymous';
				} else {
					item.display_name = profileData.display_name;
				}
				
				// Don't send email to frontend at all
				delete item.user_email;
			}
		}

		if (getMediaError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: getMediaError.message })
			};
		}

		result = { data: mediaData || [] };
		break;

	  case 'updateGalleryMedia':
		const updateMediaAuthHeader = event.headers.authorization;
		const updateMediaToken = updateMediaAuthHeader.replace('Bearer ', '');
		const { data: { user: updateMediaUser } } = await supabase.auth.getUser(updateMediaToken);
		
		const { mediaId: updateMediaId, ...updateData } = payload;
		
		// Check ownership or admin status
		const { data: mediaToUpdate } = await adminClient
			.from('user_grow_media')
			.select('user_id')
			.eq('id', updateMediaId)
			.single();
		
		// Get user role
		const { data: updateUserRole } = await adminClient
			.from('user_roles')
			.select('role')
			.eq('user_id', updateMediaUser.id)
			.single();
		
		const userRole = updateUserRole?.role || 'USER';
		const canModerate = ['OWNER', 'ADMIN', 'MODERATOR'].includes(userRole);
		const isOwner = mediaToUpdate?.user_id === updateMediaUser.id;
		
		if (!isOwner && !canModerate) {
			return {
				statusCode: 403,
				headers,
				body: JSON.stringify({ error: 'Not authorized to edit this media' })
			};
		}
		
		const { error: updateMediaError } = await adminClient
			.from('user_grow_media')
			.update(updateData)
			.eq('id', updateMediaId);
		
		if (updateMediaError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: updateMediaError.message })
			};
		}
		
		result = { success: true };
		break;

	  case 'getUserRole':
		const getRoleAuthHeader = event.headers.authorization;
		const getRoleToken = getRoleAuthHeader.replace('Bearer ', '');
		const { data: { user: getRoleUser } } = await supabase.auth.getUser(getRoleToken);
		
		const { data: roleData } = await adminClient
			.from('user_roles')
			.select('role')
			.eq('user_id', getRoleUser.id)
			.single();
		
		result = { data: { role: roleData?.role || 'USER' } };
		break;

	  case 'deleteGalleryMedia':
		const deleteMediaAuthHeader = event.headers.authorization;
		const deleteMediaToken = deleteMediaAuthHeader.replace('Bearer ', '');
		const { data: { user: deleteMediaUser } } = await supabase.auth.getUser(deleteMediaToken);
		
		const { mediaId } = payload;
		
		// Verify ownership
		const { data: mediaToDelete } = await adminClient
			.from('user_grow_media')
			.select('user_id')
			.eq('id', mediaId)
			.single();
		
		if (!mediaToDelete || mediaToDelete.user_id !== deleteMediaUser.id) {
			return {
				statusCode: 403,
				headers,
				body: JSON.stringify({ error: 'Not authorized to delete this media' })
			};
		}
		
		const { error: deleteMediaError } = await adminClient
			.from('user_grow_media')
			.delete()
			.eq('id', mediaId);
		
		if (deleteMediaError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: deleteMediaError.message })
			};
		}
		
		result = { success: true };
		break;

	  case 'adminDeleteGalleryMedia':
		const adminDeleteMediaAuthHeader = event.headers.authorization;
		const adminDeleteMediaToken = adminDeleteMediaAuthHeader.replace('Bearer ', '');
		const { data: { user: adminDeleteMediaUser } } = await supabase.auth.getUser(adminDeleteMediaToken);
		
		// Check moderator/admin status using role system
		const adminDeletePermission = await checkPermission(adminClient, adminDeleteMediaUser.id, null, 'MODERATOR');
		if (!adminDeletePermission.authorized) {
			return {
				statusCode: 403,
				headers,
				body: JSON.stringify({ error: 'Moderator access required' })
			};
		}
		
		const { error: adminDeleteMediaError } = await adminClient
			.from('user_grow_media')
			.delete()
			.eq('id', payload.mediaId);
		
		if (adminDeleteMediaError) {
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({ error: adminDeleteMediaError.message })
			};
		}
		
		result = { success: true };
		break;

	  case 'testStorage': {
			try {
				// Test 1: List buckets
				const { data: buckets, error: bucketsError } = await adminClient.storage.listBuckets();
				console.log('Buckets:', buckets, bucketsError);
				
				// Test 2: Try to access plant-images specifically
				const { data: bucket, error: bucketError } = await adminClient.storage.getBucket('plant-images');
				console.log('Specific bucket:', bucket, bucketError);
				
				return {
					statusCode: 200,
					headers,
					body: JSON.stringify({ 
						buckets: buckets || [],
						bucket: bucket || null,
						bucketsError: bucketsError?.message,
						bucketError: bucketError?.message
					})
				};
			} catch (e) {
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: e.message })
				};
			}
		}

	  case 'uploadImage': {
			const authHeader = event.headers.authorization;
			const token = authHeader.replace('Bearer ', '');
			const { data: { user } } = await supabase.auth.getUser(token);
			
			if (!user) {
				return {
					statusCode: 401,
					headers,
					body: JSON.stringify({ error: 'Unauthorized' })
				};
			}
			
			const { imageId, imageData } = payload;
			
			// Convert base64 to buffer
			const base64Data = imageData.split(',')[1];
			const buffer = Buffer.from(base64Data, 'base64');
			
			console.log('Attempting upload to bucket: plant-images');
			console.log('Path:', `${user.id}/${imageId}.jpg`);
			console.log('Buffer size:', buffer.length);
			
			// Upload to Supabase Storage
			const { data, error } = await adminClient.storage
				.from('plant-images')
				.upload(`${user.id}/${imageId}.jpg`, buffer, {
					contentType: 'image/jpeg',
					upsert: true
				});
			
			console.log('Upload result:', { data, error });
			
			if (error) {
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: error.message })
				};
			}
			
			// Get public URL
			const { data: urlData } = adminClient.storage
				.from('plant-images')
				.getPublicUrl(`${user.id}/${imageId}.jpg`);
			
			result = { data: { publicUrl: urlData.publicUrl } };
			break;
		}

      case 'getImageUrl': {
            const authHeader = event.headers.authorization;
            const token = authHeader.replace('Bearer ', '');
            const { data: { user } } = await supabase.auth.getUser(token);
            
            if (!user) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' })
                };
            }
            
            const { imageId } = payload;
            
            const { data: urlData } = adminClient.storage
                .from('plant-images')
                .getPublicUrl(`${user.id}/${imageId}.jpg`);
            
            result = { data: { publicUrl: urlData.publicUrl } };
            break;
        }

		case 'getPublicStrains': {
			const { limit = 50, offset = 0, type = null, search = null } = payload || {};
			
			let query = adminClient
				.from('strains')
				.select('id, strain_name, plant_id, type, generation, sex, notes, date_added, metadata, user_id, label_url, label_id, parent_mother_id, parent_father_id')
				.or('deleted.is.null,deleted.eq.false')
				.order('created_at', { ascending: false })
				.range(offset, offset + limit - 1);
			
			if (type && type !== 'All') query = query.eq('type', type);
			if (search && search.trim()) query = query.ilike('strain_name', `%${search.trim()}%`);
			
			const { data: strains, error: strainsError } = await query;
			
			if (strainsError) {
				return { statusCode: 500, headers, body: JSON.stringify({ error: strainsError.message }) };
			}
			
			const userIds = [...new Set(strains.map(s => s.user_id))];
			const { data: profiles } = await adminClient
				.from('user_profiles')
				.select('id, display_name, public_strains')
				.in('id', userIds);
			
			const publicStrains = strains
				.map(strain => {
					const profile = profiles?.find(p => p.id === strain.user_id);
					return { ...strain, user_profiles: profile };
				})
				.filter(strain => {
					const publicArray = strain.user_profiles?.public_strains || [];
					return publicArray.length === 0 || publicArray.includes(strain.id);
				})
				.map(strain => {
					let imageUrl = null;
					// Use stored imageUrl from metadata if available (includes cache-busting)
					if (strain.metadata?.imageUrl) {
						imageUrl = strain.metadata.imageUrl;
					} else if (strain.metadata?.imageId) {
						// Fallback: generate URL with cache-busting timestamp
						const { data: urlData } = adminClient.storage
							.from('plant-images')
							.getPublicUrl(`${strain.user_id}/${strain.metadata.imageId}.jpg`);
						imageUrl = urlData?.publicUrl ? `${urlData.publicUrl}?t=${Date.now()}` : null;
					}

					let labelUrl = null;
					// Use stored label_url if available
					if (strain.label_url) {
						labelUrl = strain.label_url;
					} else if (strain.label_id) {
						// Fallback: generate URL with cache-busting timestamp
						const { data: labelUrlData } = adminClient.storage
							.from('plant-images')
							.getPublicUrl(`${strain.user_id}/${strain.label_id}.jpg`);
						labelUrl = labelUrlData?.publicUrl ? `${labelUrlData.publicUrl}?t=${Date.now()}` : null;
					}


					return {
						id: strain.id,
						strainName: strain.strain_name,
						plantId: strain.plant_id,
						type: strain.type,
						generation: strain.generation,
						sex: strain.sex,
						notes: strain.notes,
						dateAdded: strain.date_added,
						imageUrl: imageUrl,
						labelUrl: labelUrl,
						labelId: strain.label_id,
						parentMotherId: strain.parent_mother_id,
						parentFatherId: strain.parent_father_id,
						traits: strain.metadata?.traits || {},
						breederName: strain.user_profiles?.display_name || 'Anonymous Breeder'
					};
				});
			
			result = { data: publicStrains, total: publicStrains.length, limit, offset };
			break;
		}

		case 'getPublicGalleryStats': {
			const { data: strains } = await adminClient
				.from('strains')
				.select('id, type, metadata, user_id')
				.or('deleted.is.null,deleted.eq.false');
			
			const userIds = [...new Set(strains.map(s => s.user_id))];
			const { data: profiles } = await adminClient
				.from('user_profiles')
				.select('id, public_strains')
				.in('id', userIds);
			
			const publicStrains = strains
				.map(strain => {
					const profile = profiles?.find(p => p.id === strain.user_id);
					return { ...strain, user_profiles: profile };
				})
				.filter(s => {
					const publicArray = s.user_profiles?.public_strains || [];
					return publicArray.length === 0 || publicArray.includes(s.id);
				});
			
			result = { 
				data: {
					totalStrains: publicStrains.length,
					totalBreeders: new Set(publicStrains.map(s => s.user_id)).size,
					indicaCount: publicStrains.filter(s => s.type === 'Indica').length,
					sativaCount: publicStrains.filter(s => s.type === 'Sativa').length,
					hybridCount: publicStrains.filter(s => s.type === 'Hybrid').length,
					strainsWithImages: publicStrains.filter(s => s.metadata?.imageId).length
				}
			};
			break;
		}

		case 'getExistingPlantIds': {
			const plantIdsAuthHeader = event.headers.authorization;
			const plantIdsToken = plantIdsAuthHeader.replace('Bearer ', '');
			const { data: { user: plantIdsUser } } = await supabase.auth.getUser(plantIdsToken);
			
			const { baseId } = payload;
			
			// Get all plant_ids that start with this base - INCLUDING DELETED ONES
			const { data: existingStrains } = await adminClient
				.from('strains')
				.select('plant_id')
				.eq('user_id', plantIdsUser.id)
				.ilike('plant_id', `${baseId}%`);
			
			const plantIds = (existingStrains || []).map(s => s.plant_id);
			
			result = { plantIds };
			break;
		}

		case 'updateStrainLabel': {
			const { strainId, labelUrl, labelId } = payload;

			// GET THE USER FROM TOKEN FIRST
			const authHeader = event.headers.authorization;
			if (!authHeader) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization header' }) };
			}

			const token = authHeader.replace('Bearer ', '');
			const { data: { user: updateLabelUser }, error: authError } = await supabase.auth.getUser(token);

			if (authError || !updateLabelUser) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid token' }) };
			}

			console.log('updateStrainLabel called with:', { strainId, labelUrl, labelId, userId: updateLabelUser.id });

			if (!strainId || !labelUrl) {
				return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing strainId or labelUrl' }) };
			}

			// Update the strain with the label URL and ID
			const { data: updateData, error: updateError } = await adminClient
				.from('strains')
				.update({
					label_url: labelUrl,
					label_id: labelId
				})
				.eq('id', strainId)
				.eq('user_id', updateLabelUser.id)
				.select();  // ADD THIS TO RETURN THE UPDATED ROW

			if (updateError) {
				console.error('Error updating strain label:', updateError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: 'Failed to update strain label: ' + updateError.message })
				};
			}

			console.log('Updated strain data:', updateData);

			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({
					success: true,
					message: 'Strain label updated successfully',
					data: updateData
				})
			};
		}

		case 'moderatorDeletePost': {
			const modDeleteAuthHeader = event.headers.authorization;
			if (!modDeleteAuthHeader) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization' }) };
			}

			const modDeleteToken = modDeleteAuthHeader.replace('Bearer ', '');
			const { data: { user: modDeleteUser }, error: modDeleteAuthError } = await supabase.auth.getUser(modDeleteToken);

			if (modDeleteAuthError || !modDeleteUser) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
			}

			// Check if user has moderator permissions
			const modDeletePermission = await checkPermission(adminClient, modDeleteUser.id, null, 'MODERATOR');
			if (!modDeletePermission.authorized) {
				return {
					statusCode: 403,
					headers,
					body: JSON.stringify({ error: 'Moderator access required' })
				};
			}

			const { postId } = payload;
			if (!postId) {
				return { statusCode: 400, headers, body: JSON.stringify({ error: 'postId required' }) };
			}

			// Delete the post and all replies (cascade should handle replies)
			const { error: deletePostError } = await adminClient
				.from('posts')
				.delete()
				.eq('id', postId);

			if (deletePostError) {
				console.error('Error deleting post:', deletePostError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: deletePostError.message })
				};
			}

			result = { success: true };
			break;
		}

		case 'getUserAvatar': {
			const { userId } = payload;
			if (!userId) {
				return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) };
			}

			const { data: profile, error: profileError } = await adminClient
				.from('user_profiles')
				.select('avatar_url')
				.eq('id', userId)
				.single();

			if (profileError && profileError.code !== 'PGRST116') {
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: profileError.message })
				};
			}

			result = { data: { avatar_url: profile?.avatar_url || null } };
			break;
		}

		case 'moderatorDeleteReply': {
			const modDeleteReplyAuthHeader = event.headers.authorization;
			if (!modDeleteReplyAuthHeader) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization' }) };
			}

			const modDeleteReplyToken = modDeleteReplyAuthHeader.replace('Bearer ', '');
			const { data: { user: modDeleteReplyUser }, error: modDeleteReplyAuthError } = await supabase.auth.getUser(modDeleteReplyToken);

			if (modDeleteReplyAuthError || !modDeleteReplyUser) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
			}

			// Check if user has moderator permissions
			const modDeleteReplyPermission = await checkPermission(adminClient, modDeleteReplyUser.id, null, 'MODERATOR');
			if (!modDeleteReplyPermission.authorized) {
				return {
					statusCode: 403,
					headers,
					body: JSON.stringify({ error: 'Moderator access required' })
				};
			}

			const { replyId } = payload;
			if (!replyId) {
				return { statusCode: 400, headers, body: JSON.stringify({ error: 'replyId required' }) };
			}

			// Delete the reply
			const { error: deleteReplyError } = await adminClient
				.from('replies')
				.delete()
				.eq('id', replyId);

			if (deleteReplyError) {
				console.error('Error deleting reply:', deleteReplyError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: deleteReplyError.message })
				};
			}

			result = { success: true };
			break;
		}

		case 'createBoard': {
			const createBoardAuthHeader = event.headers.authorization;
			if (!createBoardAuthHeader) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'No authorization' }) };
			}

			const createBoardToken = createBoardAuthHeader.replace('Bearer ', '');
			const { data: { user: createBoardUser }, error: createBoardAuthError } = await supabase.auth.getUser(createBoardToken);

			if (createBoardAuthError || !createBoardUser) {
				return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
			}

			// Check if user has moderator permissions (MODERATOR, ADMIN, or OWNER can create boards)
			const createBoardPermission = await checkPermission(adminClient, createBoardUser.id, null, 'MODERATOR');
			if (!createBoardPermission.authorized) {
				return {
					statusCode: 403,
					headers,
					body: JSON.stringify({ error: 'Moderator access required to create boards' })
				};
			}

			const { name, description } = payload;
			if (!name || !name.trim()) {
				return { statusCode: 400, headers, body: JSON.stringify({ error: 'Board name is required' }) };
			}

			// Create the board using adminClient to bypass RLS
			const { data: newBoard, error: createError } = await adminClient
				.from('boards')
				.insert({
					name: name.trim(),
					description: description?.trim() || null,
					created_by: createBoardUser.id
				})
				.select()
				.single();

			if (createError) {
				console.error('Error creating board:', createError);
				return {
					statusCode: 500,
					headers,
					body: JSON.stringify({ error: createError.message })
				};
			}

			result = { data: newBoard };
			break;
		}

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
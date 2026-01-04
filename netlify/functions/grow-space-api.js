const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // Get user from auth header
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'No authorization header' })
      };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const { action, payload } = JSON.parse(event.body);
    let result;

    switch(action) {
      // ============================================================================
      // PLAYER STATE
      // ============================================================================
      case 'getPlayerState': {
        const { data: playerState, error } = await adminClient
          .from('grow_space_players')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        // If no player state exists, create one with defaults
        if (!playerState) {
          const { data: newPlayer, error: createError } = await adminClient
            .from('grow_space_players')
            .insert({
              user_id: user.id,
              credits: 2400,
              current_page: 'homePage'
            })
            .select()
            .single();

          if (createError) throw createError;
          result = { data: newPlayer };
        } else {
          result = { data: playerState };
        }
        break;
      }

      case 'updatePlayerState': {
        const { credits, current_page } = payload;

        const updateData = {};
        if (credits !== undefined) updateData.credits = credits;
        if (current_page !== undefined) updateData.current_page = current_page;
        updateData.last_saved = new Date().toISOString();

        const { data: updated, error } = await adminClient
          .from('grow_space_players')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = { data: updated };
        break;
      }

      // ============================================================================
      // SHOP ITEMS
      // ============================================================================
      case 'getShopItems': {
        const { data: items, error } = await adminClient
          .from('grow_space_shop_items')
          .select('*')
          .eq('active', true)
          .order('price', { ascending: true });

        if (error) throw error;
        result = { data: items };
        break;
      }

      // ============================================================================
      // TENTS
      // ============================================================================
      case 'getTents': {
        const { data: tents, error } = await adminClient
          .from('grow_space_tents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        result = { data: tents };
        break;
      }

      case 'createTent': {
        const {
          tent_type,
          size,
          light_id,
          light_name,
          light_wattage,
          light_cycle = '18/6',
          phase = 'veg'
        } = payload;

        const { data: newTent, error } = await adminClient
          .from('grow_space_tents')
          .insert({
            user_id: user.id,
            tent_type,
            size,
            light_id,
            light_name,
            light_wattage,
            light_cycle,
            phase,
            start_date: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        // Create initial cycle for the tent
        const { data: cycle, error: cycleError } = await adminClient
          .from('grow_space_cycles')
          .insert({
            tent_id: newTent.id,
            user_id: user.id,
            start_date: null,
            phase: null,
            is_current: true
          })
          .select()
          .single();

        if (cycleError) throw cycleError;

        result = { data: { ...newTent, currentCycle: cycle } };
        break;
      }

      case 'updateTent': {
        const {
          tent_id,
          light_cycle,
          phase,
          last_fed_left,
          last_fed_right,
          last_watered_left,
          last_watered_right,
          harvest_count,
          environment
        } = payload;

        const updateData = {};
        if (light_cycle !== undefined) updateData.light_cycle = light_cycle;
        if (phase !== undefined) updateData.phase = phase;
        if (last_fed_left !== undefined) updateData.last_fed_left = last_fed_left;
        if (last_fed_right !== undefined) updateData.last_fed_right = last_fed_right;
        if (last_watered_left !== undefined) updateData.last_watered_left = last_watered_left;
        if (last_watered_right !== undefined) updateData.last_watered_right = last_watered_right;
        if (harvest_count !== undefined) updateData.harvest_count = harvest_count;
        if (environment !== undefined) updateData.environment = environment;

        const { data: updated, error } = await adminClient
          .from('grow_space_tents')
          .update(updateData)
          .eq('id', tent_id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = { data: updated };
        break;
      }

      case 'deleteTent': {
        const { tent_id } = payload;

        // Delete tent (cascade will delete logs, cycles, etc.)
        const { error } = await adminClient
          .from('grow_space_tents')
          .delete()
          .eq('id', tent_id)
          .eq('user_id', user.id);

        if (error) throw error;
        result = { success: true };
        break;
      }

      // ============================================================================
      // TENT LOGS
      // ============================================================================
      case 'getTentLogs': {
        const { tent_id, limit = 50 } = payload;

        const { data: logs, error } = await adminClient
          .from('grow_space_tent_logs')
          .select('*')
          .eq('tent_id', tent_id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        result = { data: logs };
        break;
      }

      case 'createTentLog': {
        const {
          tent_id,
          action_type,
          action_state,
          action_icon,
          left_icon,
          right_icon,
          note_text,
          environment_param,
          environment_value,
          metadata
        } = payload;

        const { data: newLog, error } = await adminClient
          .from('grow_space_tent_logs')
          .insert({
            tent_id,
            user_id: user.id,
            action_type,
            action_state,
            action_icon,
            left_icon,
            right_icon,
            note_text,
            environment_param,
            environment_value,
            metadata: metadata || {}
          })
          .select()
          .single();

        if (error) throw error;
        result = { data: newLog };
        break;
      }

      // ============================================================================
      // CYCLES
      // ============================================================================
      case 'getCycles': {
        const { tent_id } = payload;

        const { data: cycles, error } = await adminClient
          .from('grow_space_cycles')
          .select('*')
          .eq('tent_id', tent_id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        result = { data: cycles };
        break;
      }

      case 'getCurrentCycle': {
        const { tent_id } = payload;

        const { data: cycle, error } = await adminClient
          .from('grow_space_cycles')
          .select('*')
          .eq('tent_id', tent_id)
          .eq('user_id', user.id)
          .eq('is_current', true)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        result = { data: cycle || null };
        break;
      }

      case 'updateCycle': {
        const {
          cycle_id,
          start_date,
          end_date,
          harvest_date,
          phase,
          phase_changes,
          is_current
        } = payload;

        const updateData = {};
        if (start_date !== undefined) updateData.start_date = start_date;
        if (end_date !== undefined) updateData.end_date = end_date;
        if (harvest_date !== undefined) updateData.harvest_date = harvest_date;
        if (phase !== undefined) updateData.phase = phase;
        if (phase_changes !== undefined) updateData.phase_changes = phase_changes;
        if (is_current !== undefined) updateData.is_current = is_current;

        const { data: updated, error } = await adminClient
          .from('grow_space_cycles')
          .update(updateData)
          .eq('id', cycle_id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = { data: updated };
        break;
      }

      case 'createCycle': {
        const { tent_id, start_date, phase } = payload;

        // End current cycle if exists
        await adminClient
          .from('grow_space_cycles')
          .update({ is_current: false })
          .eq('tent_id', tent_id)
          .eq('user_id', user.id)
          .eq('is_current', true);

        // Create new cycle
        const { data: newCycle, error } = await adminClient
          .from('grow_space_cycles')
          .insert({
            tent_id,
            user_id: user.id,
            start_date: start_date || new Date().toISOString(),
            phase: phase || 'veg',
            is_current: true
          })
          .select()
          .single();

        if (error) throw error;
        result = { data: newCycle };
        break;
      }

      // ============================================================================
      // CYCLE NOTES
      // ============================================================================
      case 'getCycleNotes': {
        const { cycle_id } = payload;

        const { data: notes, error } = await adminClient
          .from('grow_space_cycle_notes')
          .select('*')
          .eq('cycle_id', cycle_id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        result = { data: notes };
        break;
      }

      case 'createCycleNote': {
        const { cycle_id, note_text } = payload;

        const { data: newNote, error } = await adminClient
          .from('grow_space_cycle_notes')
          .insert({
            cycle_id,
            user_id: user.id,
            note_text
          })
          .select()
          .single();

        if (error) throw error;
        result = { data: newNote };
        break;
      }

      case 'deleteCycleNote': {
        const { note_id } = payload;

        const { error } = await adminClient
          .from('grow_space_cycle_notes')
          .delete()
          .eq('id', note_id)
          .eq('user_id', user.id);

        if (error) throw error;
        result = { success: true };
        break;
      }

      // ============================================================================
      // BULK OPERATIONS
      // ============================================================================
      case 'getAllGameData': {
        // Get all data for the user in one request
        const [
          { data: playerState },
          { data: tents },
          { data: logs },
          { data: cycles },
          { data: notes },
          { data: shopItems }
        ] = await Promise.all([
          adminClient.from('grow_space_players').select('*').eq('user_id', user.id).single(),
          adminClient.from('grow_space_tents').select('*').eq('user_id', user.id),
          adminClient.from('grow_space_tent_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          adminClient.from('grow_space_cycles').select('*').eq('user_id', user.id),
          adminClient.from('grow_space_cycle_notes').select('*').eq('user_id', user.id),
          adminClient.from('grow_space_shop_items').select('*').eq('active', true)
        ]);

        result = {
          data: {
            playerState: playerState || { credits: 2400, current_page: 'homePage' },
            tents: tents || [],
            logs: logs || [],
            cycles: cycles || [],
            notes: notes || [],
            shopItems: shopItems || []
          }
        };
        break;
      }

      case 'migrateLocalStorage': {
        // Migrate data from local storage to database
        const { gameState } = payload;

        // Create or update player state
        const { data: player, error: playerError } = await adminClient
          .from('grow_space_players')
          .upsert({
            user_id: user.id,
            credits: gameState.credits || 2400,
            current_page: gameState.currentPage || 'homePage',
            last_saved: new Date().toISOString()
          }, { onConflict: 'user_id' })
          .select()
          .single();

        if (playerError) throw playerError;

        // Migrate tents
        const migratedTents = [];
        if (gameState.tents && gameState.tents.length > 0) {
          for (const tent of gameState.tents) {
            // Create tent
            const { data: newTent, error: tentError } = await adminClient
              .from('grow_space_tents')
              .insert({
                user_id: user.id,
                tent_type: tent.type,
                size: tent.size,
                light_id: tent.light?.id || null,
                light_name: tent.light?.name || null,
                light_wattage: tent.light?.wattage || null,
                light_cycle: tent.lightCycle || '18/6',
                phase: tent.phase || 'veg',
                start_date: tent.startDate || new Date().toISOString(),
                last_fed_left: tent.lastFed?.left || null,
                last_fed_right: tent.lastFed?.right || null,
                last_watered_left: tent.lastWatered?.left || null,
                last_watered_right: tent.lastWatered?.right || null,
                harvest_count: tent.harvestCount || 0,
                environment: tent.environment || {}
              })
              .select()
              .single();

            if (tentError) throw tentError;
            migratedTents.push(newTent);

            // Create current cycle
            if (tent.currentCycle) {
              const { error: cycleError } = await adminClient
                .from('grow_space_cycles')
                .insert({
                  tent_id: newTent.id,
                  user_id: user.id,
                  start_date: tent.currentCycle.startDate || null,
                  phase: tent.currentCycle.phase || null,
                  phase_changes: tent.currentCycle.phaseChanges || [],
                  is_current: true
                });

              if (cycleError) throw cycleError;
            }

            // Migrate logs
            if (tent.logs && tent.logs.length > 0) {
              const logsToInsert = tent.logs.map(log => ({
                tent_id: newTent.id,
                user_id: user.id,
                action_type: log.action || 'unknown',
                action_state: log.state || null,
                action_icon: log.icon || null,
                left_icon: log.left || null,
                right_icon: log.right || null,
                note_text: log.note || log.text || null,
                environment_param: log.param || null,
                environment_value: log.value || null,
                created_at: log.date || new Date().toISOString()
              }));

              const { error: logsError } = await adminClient
                .from('grow_space_tent_logs')
                .insert(logsToInsert);

              if (logsError) throw logsError;
            }
          }
        }

        result = {
          success: true,
          data: {
            player,
            tents: migratedTents
          }
        };
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
    console.error('Grow Space API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};

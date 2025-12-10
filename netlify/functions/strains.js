const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

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

  try {
    const { action, data: payload } = JSON.parse(event.body);

    switch(action) {
      case 'getAll':
        const { data: strains, error: getError } = await supabase
          .from('strains')
          .select('*')
          .eq('user_id', user.id)
          .eq('deleted', false)
          .order('created_at', { ascending: false });
        
        if (getError) throw getError;
        return { statusCode: 200, headers, body: JSON.stringify(strains) };

      case 'create':
        const { data: newStrain, error: createError } = await supabase
          .from('strains')
          .insert([{ ...payload, user_id: user.id }])
          .select()
          .single();
        
        if (createError) throw createError;
        return { statusCode: 200, headers, body: JSON.stringify(newStrain) };

      case 'update':
        const { data: updatedStrain, error: updateError } = await supabase
          .from('strains')
          .update(payload.updates)
          .eq('id', payload.id)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return { statusCode: 200, headers, body: JSON.stringify(updatedStrain) };

      case 'delete':
        const { error: deleteError } = await supabase
          .from('strains')
          .update({ deleted: true })
          .eq('id', payload.id)
          .eq('user_id', user.id);
        
        // Mark any breeding pairs using this strain as incomplete
        await supabase
          .from('breeding_pairs')
          .update({ incomplete: true })
          .or(`mother_id.eq.${payload.id},father_id.eq.${payload.id}`)
          .eq('user_id', user.id);
        
        if (deleteError) throw deleteError;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.string
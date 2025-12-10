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
        const { data: pairs, error: getError } = await supabase
          .from('breeding_pairs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (getError) throw getError;
        return { statusCode: 200, headers, body: JSON.stringify(pairs) };

      case 'create':
        const { data: newPair, error: createError } = await supabase
          .from('breeding_pairs')
          .insert([{ ...payload, user_id: user.id }])
          .select()
          .single();
        
        if (createError) throw createError;
        return { statusCode: 200, headers, body: JSON.stringify(newPair) };

      case 'update':
        const { data: updatedPair, error: updateError } = await supabase
          .from('breeding_pairs')
          .update(payload.updates)
          .eq('id', payload.id)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return { statusCode: 200, headers, body: JSON.stringify(updatedPair) };

      case 'delete':
        const { error: deleteError } = await supabase
          .from('breeding_pairs')
          .delete()
          .eq('id', payload.id)
          .eq('user_id', user.id);
        
        if (deleteError) throw deleteError;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Breeding pairs function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
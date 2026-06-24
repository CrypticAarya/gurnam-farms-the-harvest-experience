import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.rpc('get_profile_columns');
  console.log("RPC Error:", error);

  // Instead of RPC since I don't know if we can execute RPC, let's just insert a dummy profile to see what happens.
  const { error: insertError } = await supabase.from('profiles').insert([{ id: '00000000-0000-0000-0000-000000000000', email: 'test@test.com' }]);
  console.log("Insert Error:", insertError);
}
test();

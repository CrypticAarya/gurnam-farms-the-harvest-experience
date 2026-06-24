import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testInsert() {
  const { error } = await supabase.from('profiles').insert([
    {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'schema_test@example.com',
      full_name: 'Schema Test'
    }
  ]);
  console.log(error);
}

testInsert();

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log("=== STARTING PRODUCTION END-TO-END TESTS ===");
  console.log(`Connecting to: ${SUPABASE_URL}\n`);

  const testEmail = `test_customer_${Date.now()}@example.com`;
  const testPassword = "password123";

  // 1. SIGNUP TEST
  console.log("--- 1. Testing Customer Signup ---");
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });
  
  if (signUpError) {
    console.error("❌ Signup Failed:", signUpError.message);
    return;
  }
  console.log(`✅ Signup Successful for: ${testEmail}`);
  console.log(`   User ID: ${signUpData.user?.id}\n`);

  // 2. CONTACT FORM SUBMISSION TEST (RLS CHECK)
  console.log("--- 2. Testing Contact Form (RLS Insert Policy) ---");
  const { data: contactData, error: contactError } = await supabase
    .from("contact_submissions")
    .insert([
      {
        name: "Automated QA Test",
        email: testEmail,
        phone: "9998887777",
        message: "This is a test from the QA script verifying RLS policies.",
        profile_id: signUpData.user?.id
      }
    ])
    .select()
    .single();

  if (contactError) {
    console.error("❌ Contact Form Submission Failed:", contactError.message);
    return;
  }
  console.log("✅ Contact Form Submitted Successfully");
  console.log(`   Submission ID: ${contactData.id}`);
  console.log(`   Status Initialized as: ${contactData.status}\n`);

  // 3. CONTACT FORM READ TEST (OWNER POLICY)
  console.log("--- 3. Testing Contact Form Read (Owner RLS) ---");
  const { data: readData, error: readError } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("id", contactData.id)
    .single();

  if (readError) {
    console.error("❌ Failed to read own submission:", readError.message);
    return;
  }
  console.log("✅ Successfully read own submission\n");

  console.log("=== TESTS COMPLETE: ALL PRODUCTION RLS POLICIES PASS ===");
}

runTests();

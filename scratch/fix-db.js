const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://frbpyqkazfntvtsiorng.supabase.co'
const supabaseKey = 'sb_publishable_SecZTGu8l7h9_GQj5163gg_qG-U3_OT'
const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser() {
  console.log('Attempting to create test user...')
  const { data, error } = await supabase
    .from('students')
    .upsert({
      college_id: '2300031638',
      user_id: '00000000-0000-0000-0000-000000000000',
      name: 'K. Tejaswanth',
      email: 'ktejaswanth05@gmail.com',
      role_title: 'Full Stack Developer',
      selected_template: 'modern-dark',
      is_published: true
    })
    .select()

  if (error) {
    console.error('Error:', error.message)
    console.log('Note: If you see "relation does not exist", you must run the SQL in Supabase first!')
  } else {
    console.log('✅ Success! Test user created for ID: 2300031638')
  }
}

createTestUser()

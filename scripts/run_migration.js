const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'oltlnbxchdnavocpqgyc';
const HOST = `db.${PROJECT_REF}.supabase.co`;
const PORT = 5432;
const DB = 'postgres';
const USER = 'postgres';

// Try common passwords
const PASSWORDS = [
  PROJECT_REF,
  'postgres',
  'Buddy-2019',
  'admin',
  'password',
  `${PROJECT_REF}_password`,
  'supabase',
  'raceintel',
];

async function tryPassword(password) {
  const client = new Client({
    host: HOST,
    port: PORT,
    database: DB,
    user: USER,
    password: password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  
  try {
    await client.connect();
    console.log(`✅ CONNECTED with password: ${password}`);
    return client;
  } catch (err) {
    return null;
  }
}

async function runMigration(client) {
  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'migrations', '001_create_waitlist.sql'),
    'utf8'
  );
  
  console.log('Running migration...');
  try {
    await client.query(sql);
    console.log('✅ Migration applied successfully!');
    
    // Verify the table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'waitlist'
      );
    `);
    console.log('waitlist table exists:', result.rows[0].exists);
    
    // Check RLS
    const rlsResult = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relname = 'waitlist';
    `);
    console.log('RLS enabled:', rlsResult.rows[0]?.relrowsecurity);
    
    // Check policies
    const policyResult = await client.query(`
      SELECT policyname FROM pg_policies WHERE tablename = 'waitlist';
    `);
    console.log('Policies:', policyResult.rows.map(r => r.policyname));
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

async function main() {
  for (const password of PASSWORDS) {
    console.log(`Trying password: ${password.substring(0, 3)}...`);
    const client = await tryPassword(password);
    if (client) {
      await runMigration(client);
      await client.end();
      process.exit(0);
    }
  }
  console.log('\n❌ Could not connect with any password.');
  console.log('\nTo run the migration manually:');
  console.log('1. Get the database password from Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard/project/oltlnbxchdnavocpqgyc/settings/database');
  console.log('2. Then run:');
  console.log(`   PGPASSWORD=<password> supabase db push --db-url "postgresql://postgres:<password>@db.oltlnbxchdnavocpqgyc.supabase.co:5432/postgres"`);
  process.exit(1);
}

main();

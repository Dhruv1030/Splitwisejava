-- Test Connection Script for Splitwise Clone Database
-- Run this first to verify your database connection and basic setup

\echo 'Testing database connection and basic setup...'

-- Test 1: Check if we can connect and see tables
\echo 'Test 1: Checking existing tables...'
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Test 2: Check User table structure
\echo 'Test 2: Checking User table structure...'
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user' 
ORDER BY ordinal_position;

-- Test 3: Check Group table structure
\echo 'Test 3: Checking Group table structure...'
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'group' 
ORDER BY ordinal_position;

-- Test 4: Check if we can create a test table (permissions test)
\echo 'Test 4: Testing permissions...'
CREATE TABLE IF NOT EXISTS test_migration_permissions (
    id SERIAL PRIMARY KEY,
    test_column VARCHAR(50)
);

-- Test 5: Insert and select test data
\echo 'Test 5: Testing basic CRUD operations...'
INSERT INTO test_migration_permissions (test_column) VALUES ('migration_test') ON CONFLICT DO NOTHING;
SELECT * FROM test_migration_permissions WHERE test_column = 'migration_test';

-- Test 6: Clean up test table
\echo 'Test 6: Cleaning up test data...'
DROP TABLE IF EXISTS test_migration_permissions;

\echo 'All connection tests passed! Your database is ready for migration.'
\echo 'You can now run the main migration script: run_migrations.sql'

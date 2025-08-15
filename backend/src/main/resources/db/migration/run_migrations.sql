-- Master Migration Script for Splitwise Clone v2.0
-- This script runs all migrations in the correct order
-- Run this script on your PostgreSQL database to upgrade to the new version

-- Start transaction
BEGIN;

-- Migration 1: Enhance User Model
\echo 'Running Migration 1: Enhance User Model...'
\i V2__enhance_user_model.sql

-- Migration 2: Create Contacts Table
\echo 'Running Migration 2: Create Contacts Table...'
\i V3__create_contacts_table.sql

-- Migration 3: Enhance Group Model
\echo 'Running Migration 3: Enhance Group Model...'
\i V4__enhance_group_model.sql

-- Verify all tables and columns were created
\echo 'Verifying migration results...'

-- Check User table enhancements
\echo 'User table columns:'
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user' 
ORDER BY ordinal_position;

-- Check Contact table
\echo 'Contact table columns:'
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'contact' 
ORDER BY ordinal_position;

-- Check Group table enhancements
\echo 'Group table columns:'
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'group' 
ORDER BY ordinal_position;

-- Check indexes
\echo 'New indexes created:'
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('user', 'contact', 'group')
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Commit transaction
COMMIT;

\echo 'All migrations completed successfully!'
\echo 'Your Splitwise Clone database is now upgraded to version 2.0'

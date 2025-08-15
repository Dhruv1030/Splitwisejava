-- Rollback Script for Splitwise Clone v2.0
-- WARNING: This will remove all new features and data
-- Only run this if you need to revert to the previous version

-- Start transaction
BEGIN;

\echo 'Rolling back Splitwise Clone v2.0 migrations...'

-- Rollback Migration 3: Remove Group enhancements
\echo 'Rolling back Group enhancements...'
ALTER TABLE "group" DROP COLUMN IF EXISTS icon_url;
ALTER TABLE "group" DROP COLUMN IF EXISTS icon_name;
ALTER TABLE "group" DROP COLUMN IF EXISTS cover_image_url;
ALTER TABLE "group" DROP COLUMN IF EXISTS default_currency;
ALTER TABLE "group" DROP COLUMN IF EXISTS group_type;
ALTER TABLE "group" DROP COLUMN IF EXISTS privacy_level;
ALTER TABLE "group" DROP COLUMN IF EXISTS is_active;
ALTER TABLE "group" DROP COLUMN IF EXISTS is_archived;
ALTER TABLE "group" DROP COLUMN IF EXISTS simplify_debts;
ALTER TABLE "group" DROP COLUMN IF EXISTS auto_settle;
ALTER TABLE "group" DROP COLUMN IF EXISTS allow_member_add_expense;
ALTER TABLE "group" DROP COLUMN IF EXISTS allow_member_edit_expense;
ALTER TABLE "group" DROP COLUMN IF EXISTS require_approval_for_expense;
ALTER TABLE "group" DROP COLUMN IF EXISTS notification_enabled;
ALTER TABLE "group" DROP COLUMN IF EXISTS created_at;
ALTER TABLE "group" DROP COLUMN IF EXISTS updated_at;

-- Drop group enum types
DROP TYPE IF EXISTS group_type;
DROP TYPE IF EXISTS privacy_level;

-- Rollback Migration 2: Remove Contacts table
\echo 'Rolling back Contacts table...'
DROP TABLE IF EXISTS contact CASCADE;
DROP TYPE IF EXISTS contact_status;
DROP TYPE IF EXISTS relationship_type;

-- Rollback Migration 1: Remove User enhancements
\echo 'Rolling back User enhancements...'
ALTER TABLE "user" DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE "user" DROP COLUMN IF EXISTS phone;
ALTER TABLE "user" DROP COLUMN IF EXISTS default_currency;
ALTER TABLE "user" DROP COLUMN IF EXISTS timezone;
ALTER TABLE "user" DROP COLUMN IF EXISTS language;
ALTER TABLE "user" DROP COLUMN IF EXISTS email_notifications;
ALTER TABLE "user" DROP COLUMN IF EXISTS push_notifications;
ALTER TABLE "user" DROP COLUMN IF EXISTS expense_notifications;
ALTER TABLE "user" DROP COLUMN IF EXISTS settlement_notifications;
ALTER TABLE "user" DROP COLUMN IF EXISTS is_active;
ALTER TABLE "user" DROP COLUMN IF EXISTS is_verified;
ALTER TABLE "user" DROP COLUMN IF EXISTS two_factor_enabled;
ALTER TABLE "user" DROP COLUMN IF EXISTS last_login;
ALTER TABLE "user" DROP COLUMN IF EXISTS created_at;
ALTER TABLE "user" DROP COLUMN IF EXISTS updated_at;

-- Drop indexes (they will be automatically dropped with columns)
\echo 'Rollback completed successfully!'
\echo 'Database reverted to previous version'

-- Commit transaction
COMMIT;

-- Migration: Enhance Group Model with Advanced Features
-- Version: 4.0
-- Description: Add visual customization, settings, permissions, and advanced group management

-- Create enum types for group type and privacy level
CREATE TYPE group_type AS ENUM ('GENERAL', 'TRIP', 'ROOMMATE', 'WORK', 'FAMILY', 'EVENT', 'OTHER');
CREATE TYPE privacy_level AS ENUM ('PUBLIC', 'PRIVATE', 'INVITE_ONLY');

-- Add new columns to the groups table
ALTER TABLE groups ADD COLUMN IF NOT EXISTS icon_url VARCHAR(500);
ALTER TABLE groups ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100) DEFAULT 'fas fa-users';
ALTER TABLE groups ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);
ALTER TABLE groups ADD COLUMN IF NOT EXISTS default_currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE groups ADD COLUMN IF NOT EXISTS group_type group_type DEFAULT 'GENERAL';
ALTER TABLE groups ADD COLUMN IF NOT EXISTS privacy_level privacy_level DEFAULT 'PRIVATE';
ALTER TABLE groups ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS simplify_debts BOOLEAN DEFAULT true;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS auto_settle BOOLEAN DEFAULT false;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS allow_member_add_expense BOOLEAN DEFAULT true;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS allow_member_edit_expense BOOLEAN DEFAULT false;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS require_approval_for_expense BOOLEAN DEFAULT false;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN DEFAULT true;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_group_created_by ON groups(created_by);
CREATE INDEX IF NOT EXISTS idx_group_is_active ON groups(is_active);
CREATE INDEX IF NOT EXISTS idx_group_is_archived ON groups(is_archived);
CREATE INDEX IF NOT EXISTS idx_group_type ON groups(group_type);
CREATE INDEX IF NOT EXISTS idx_group_privacy_level ON groups(privacy_level);
CREATE INDEX IF NOT EXISTS idx_group_created_at ON groups(created_at);

-- Add comments for documentation
COMMENT ON COLUMN groups.icon_url IS 'URL to group icon image';
COMMENT ON COLUMN groups.icon_name IS 'FontAwesome icon name for the group';
COMMENT ON COLUMN groups.cover_image_url IS 'URL to group cover image';
COMMENT ON COLUMN groups.default_currency IS 'Default currency for the group (ISO 4217)';
COMMENT ON COLUMN groups.group_type IS 'Type/category of the group';
COMMENT ON COLUMN groups.privacy_level IS 'Privacy setting for the group';
COMMENT ON COLUMN groups.is_active IS 'Whether the group is active';
COMMENT ON COLUMN groups.is_archived IS 'Whether the group is archived';
COMMENT ON COLUMN groups.simplify_debts IS 'Enable debt simplification algorithm';
COMMENT ON COLUMN groups.auto_settle IS 'Enable automatic settlement suggestions';
COMMENT ON COLUMN groups.allow_member_add_expense IS 'Allow members to add expenses';
COMMENT ON COLUMN groups.allow_member_edit_expense IS 'Allow members to edit expenses';
COMMENT ON COLUMN groups.require_approval_for_expense IS 'Require admin approval for expenses';
COMMENT ON COLUMN groups.notification_enabled IS 'Enable group notifications';
COMMENT ON COLUMN groups.created_at IS 'Group creation timestamp';
COMMENT ON COLUMN groups.updated_at IS 'Last update timestamp';

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_group_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_group_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION update_group_updated_at();

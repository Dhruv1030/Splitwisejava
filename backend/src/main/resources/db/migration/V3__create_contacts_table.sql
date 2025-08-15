-- Migration: Create Contacts Table
-- Version: 3.0
-- Description: Create contacts/friends system table with relationship management

-- Create enum types for contact status and relationship type
CREATE TYPE contact_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');
CREATE TYPE relationship_type AS ENUM ('FRIEND', 'FAMILY', 'COLLEAGUE', 'ROOMMATE', 'OTHER');

-- Create contacts table
CREATE TABLE IF NOT EXISTS contact (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    contact_user_id BIGINT,
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    status contact_status DEFAULT 'PENDING',
    relationship_type relationship_type DEFAULT 'FRIEND',
    is_blocked BOOLEAN DEFAULT false,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_contact_contact_user FOREIGN KEY (contact_user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraints
    CONSTRAINT uk_contact_user_contact UNIQUE (user_id, contact_user_id),
    CONSTRAINT uk_contact_user_email UNIQUE (user_id, contact_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_user_id ON contact(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_contact_user_id ON contact(contact_user_id);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact(status);
CREATE INDEX IF NOT EXISTS idx_contact_relationship_type ON contact(relationship_type);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact(contact_email);
CREATE INDEX IF NOT EXISTS idx_contact_added_at ON contact(added_at);

-- Add comments for documentation
COMMENT ON TABLE contact IS 'Contacts/friends system for user relationships';
COMMENT ON COLUMN contact.id IS 'Primary key';
COMMENT ON COLUMN contact.user_id IS 'Owner of the contact list';
COMMENT ON COLUMN contact.contact_user_id IS 'User being added as contact (if registered)';
COMMENT ON COLUMN contact.contact_name IS 'Display name for the contact';
COMMENT ON COLUMN contact.contact_email IS 'Email address of the contact';
COMMENT ON COLUMN contact.contact_phone IS 'Phone number of the contact';
COMMENT ON COLUMN contact.status IS 'Current status of the contact relationship';
COMMENT ON COLUMN contact.relationship_type IS 'Type of relationship with the contact';
COMMENT ON COLUMN contact.is_blocked IS 'Whether the contact is blocked';
COMMENT ON COLUMN contact.added_at IS 'When the contact was added';
COMMENT ON COLUMN contact.updated_at IS 'When the contact was last updated';

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contact_updated_at
    BEFORE UPDATE ON contact
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_updated_at();

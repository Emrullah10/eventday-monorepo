-- Migration: Add status and source to events table
ALTER TABLE events ADD COLUMN status VARCHAR(20) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'REJECTED'));
ALTER TABLE events ADD COLUMN source VARCHAR(50) DEFAULT 'MANUAL';
ALTER TABLE events ADD COLUMN external_id VARCHAR(255); -- To track sources and prevent duplicates better

-- Update Existing events to PUBLISHED
UPDATE events SET status = 'PUBLISHED' WHERE status IS NULL;

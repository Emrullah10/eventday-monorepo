-- Event domain: events (includes former migration_v2 columns: status/source/external_id)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    event_type VARCHAR(50) CHECK (event_type IN ('BOOTCAMP', 'MEETUP', 'WORKSHOP', 'CONFERENCE')),
    price DECIMAL(10, 2) DEFAULT 0.00,
    quota INTEGER NOT NULL,
    organizer_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'REJECTED')),
    source VARCHAR(50) DEFAULT 'MANUAL',
    external_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE vehicles (
                          id UUID PRIMARY KEY,
                          organization_id UUID NOT NULL,
                          created_at TIMESTAMP NOT NULL,
                          updated_at TIMESTAMP,
                          name VARCHAR(255) NOT NULL,
                          capacity_kg INTEGER NOT NULL,
                          start_shift_minutes INTEGER NOT NULL,
                          end_shift_minutes INTEGER NOT NULL,
                          start_lat DOUBLE PRECISION,
                          start_lon DOUBLE PRECISION
);

CREATE INDEX idx_vehicles_org ON vehicles(organization_id);
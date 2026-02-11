CREATE TABLE delivery_orders (
                                 id UUID PRIMARY KEY,
                                 organization_id UUID NOT NULL,
                                 created_at TIMESTAMP NOT NULL,
                                 updated_at TIMESTAMP,
                                 latitude DOUBLE PRECISION NOT NULL,
                                 longitude DOUBLE PRECISION NOT NULL,
                                 weight_kg INTEGER NOT NULL,
                                 service_duration_min INTEGER NOT NULL,
                                 status VARCHAR(50) NOT NULL DEFAULT 'UNASSIGNED'
);

-- This creates a "speed lane" for finding orders by company
CREATE INDEX idx_orders_org ON delivery_orders(organization_id);
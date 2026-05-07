-- Ensure the schema exists
CREATE SCHEMA IF NOT EXISTS stage;
SET search_path TO stage;

CREATE TABLE IF NOT EXISTS coaction_feed_inventory (
    id                      SERIAL PRIMARY KEY,
    feed_id                 VARCHAR(100) UNIQUE NOT NULL,
    feed_name               VARCHAR(255) NOT NULL,
    feed_description        TEXT,
    feed_type               VARCHAR(100),
    business_domain         VARCHAR(100),
    data_owner              VARCHAR(255),
    product_owner           VARCHAR(255),
    data_source             VARCHAR(100),
    source_system           VARCHAR(255),
    vendor_partner          VARCHAR(255),
    transfer_method         VARCHAR(100),
    file_format             VARCHAR(100),
    encryption              VARCHAR(100),
    contains_pii            BOOLEAN DEFAULT FALSE,
    masking                 BOOLEAN DEFAULT FALSE,
    data_provisioned_to_gp  BOOLEAN DEFAULT FALSE,
    date_provisioned        DATE,
    jira                    VARCHAR(100),
    credentials             TEXT,
    access                  TEXT,
    last_change_date        DATE,
    version                 NUMERIC(3,1),
    environment             VARCHAR(10) DEFAULT 'DEV',
    comments                TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION coaction_feed_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_coaction_feed_inventory_updated_at ON coaction_feed_inventory;

CREATE TRIGGER trg_coaction_feed_inventory_updated_at
    BEFORE UPDATE ON coaction_feed_inventory
    FOR EACH ROW
    EXECUTE FUNCTION coaction_feed_update_updated_at_column();

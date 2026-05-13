-- =====================================================
-- Data Integrations table (coaction_feed_data_integrations)
-- Schema: stage
-- =====================================================
CREATE TABLE IF NOT EXISTS stage.coaction_feed_data_integrations (
  id              SERIAL PRIMARY KEY,
  domain          VARCHAR(100),
  source_system   VARCHAR(255),
  source_platform VARCHAR(255),
  integration_interface VARCHAR(500),
  target_system   VARCHAR(255),
  target_layer    VARCHAR(100),
  target_platform VARCHAR(255),
  feed_type       VARCHAR(100),
  frequency       VARCHAR(100),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- API Library table (coaction_feed_api_library)
-- Schema: stage
-- =====================================================
CREATE TABLE IF NOT EXISTS stage.coaction_feed_api_library (
  id              SERIAL PRIMARY KEY,
  row_num         INTEGER,
  exportable      VARCHAR(10),
  row_type        VARCHAR(100),
  match           VARCHAR(10),
  name            VARCHAR(500),
  description     TEXT,
  source_owner    VARCHAR(255),
  source_type     VARCHAR(100),
  data_source     VARCHAR(255),
  integration_type VARCHAR(100),
  target_owner    VARCHAR(255),
  target_type     VARCHAR(100),
  target          VARCHAR(255),
  status          VARCHAR(50),
  domain          VARCHAR(100),
  point_of_contact VARCHAR(255),
  origin          VARCHAR(255),
  questions       TEXT,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- Data Sources table (coaction_feed_data_sources)
-- Schema: stage
-- =====================================================
CREATE TABLE IF NOT EXISTS stage.coaction_feed_data_sources (
  id              SERIAL PRIMARY KEY,
  data_source_name VARCHAR(255) NOT NULL,
  server_name     VARCHAR(255),
  environment     VARCHAR(50),
  database_type   VARCHAR(100),
  status          VARCHAR(50),
  recovery_model  VARCHAR(50),
  legacy_or_new   VARCHAR(20),
  access_level    VARCHAR(50),
  contains_pii    BOOLEAN DEFAULT FALSE,
  data_masking    BOOLEAN DEFAULT FALSE,
  provisioned_to_gp BOOLEAN DEFAULT FALSE,
  date_provisioned DATE,
  jira            VARCHAR(255),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

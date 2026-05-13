-- =====================================================
-- Migration: Add PII/PHI, Data Masking, Provisioned to GP,
--            Date Provisioned, and Jira columns to
--            coaction_feed_data_sources
-- Schema: stage
-- =====================================================

ALTER TABLE stage.coaction_feed_data_sources
  ADD COLUMN IF NOT EXISTS contains_pii      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS data_masking       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS provisioned_to_gp  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS date_provisioned   DATE,
  ADD COLUMN IF NOT EXISTS jira               VARCHAR(255);

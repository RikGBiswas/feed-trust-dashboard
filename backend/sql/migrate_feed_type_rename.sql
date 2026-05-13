-- =====================================================
-- Migration: Rename feed_type values
--   'Internal' → 'Inbound'
--   'External' → 'Outbound'
-- Table: stage.coaction_feed_inventory
-- =====================================================

UPDATE stage.coaction_feed_inventory
SET feed_type = 'Inbound', updated_at = NOW()
WHERE LOWER(feed_type) = 'internal';

UPDATE stage.coaction_feed_inventory
SET feed_type = 'Outbound', updated_at = NOW()
WHERE LOWER(feed_type) = 'external';

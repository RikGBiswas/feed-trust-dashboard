-- Migration: Replace access_owners and access_type with a single access column
-- Run this BEFORE running seed_data.sql

SET search_path TO stage;

-- Add the new access column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'stage'
          AND table_name = 'coaction_feed_inventory'
          AND column_name = 'access'
    ) THEN
        ALTER TABLE coaction_feed_inventory ADD COLUMN access TEXT;
    END IF;
END $$;

-- Drop old columns if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'stage'
          AND table_name = 'coaction_feed_inventory'
          AND column_name = 'access_owners'
    ) THEN
        ALTER TABLE coaction_feed_inventory DROP COLUMN access_owners;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'stage'
          AND table_name = 'coaction_feed_inventory'
          AND column_name = 'access_type'
    ) THEN
        ALTER TABLE coaction_feed_inventory DROP COLUMN access_type;
    END IF;
END $$;

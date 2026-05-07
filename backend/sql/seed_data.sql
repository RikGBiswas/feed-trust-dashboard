-- Auto-generated from DataFeedInventory_050626.xlsx
-- Run this against the stage schema

SET search_path TO stage;

-- Drop all existing data
TRUNCATE TABLE coaction_feed_inventory RESTART IDENTITY CASCADE;

-- Insert data from Excel
INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-100', 'Workday GL Loss File Drop - Premium', 'Internal', 'Claims',
  'Workday', 'Coaction', 'Coaction', 'CoreODS',
  'Workday', 'Application', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-101', 'Sapiens TRF250 File Drop - Claims', 'External', 'Claims',
  'Sapiens', 'Coaction', 'Sapiens', 'CoreODS',
  'Sapiens', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-102', 'Billing feed', 'Internal', 'Policy',
  'Coaction', 'Coaction', 'Sapiens', 'CoreODS',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-103', 'Ledger feed - Claims', 'Internal', 'Policy',
  'Workday', 'Coaction', 'Coaction', 'CoreODS',
  'Workday', 'Application', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-104', 'TRF250 Premium file drop', 'External', 'Policy',
  'Sapiens', 'Coaction', 'Sapiens', 'CoreODS',
  'Sapiens', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-105', 'Sapiens Loss File Drop', 'External', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Sapiens (fka URS)',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-106', 'LPT Premia Extract', 'External', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'EDW',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-107', 'TPA Claims Reconciliation - NARS', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-108', 'TPA Claims Reconciliation - YORK', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-109', 'TPA Claims Reconciliation - Tristar', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-110', 'TPA Claims Reconciliation - Komodo', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-111', 'TPA Claims Reconciliation - MLDLPT', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-112', 'TPA Claims Reconciliation - LWP', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-113', 'TPA Claims Reconciliation - CCMSI', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-114', 'TPA Claims Reconciliation - AVALON', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-115', 'TPA Claims Reconciliation - GB', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-116', 'TPA Claims Reconciliation - Sedgwick', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'Digitide',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-117', 'Monthly External Loss Run - BigBus', 'External', 'Claims',
  'Big Bus', 'Coaction', 'Big Bus', 'RDM',
  'Big Bus', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-118', 'Monthly External Loss Run - Avalon', 'External', 'Claims',
  'Avalon', 'Coaction', 'Avalon', 'RDM',
  'Avalon', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-119', 'Monthly External Loss Run - ManufacturingHousing', 'External', 'Claims',
  'ManufacturingHousing', 'Coaction', 'ManufacturingHousing', 'RDM',
  'ManufacturingHousing', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-120', 'Monthly External Loss Run - Dattco', 'External', 'Claims',
  'Dattco', 'Coaction', 'Dattco', 'RDM',
  'Dattco', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-121', 'Monthly External Loss Run - ElExpreso', 'External', 'Claims',
  'ElExpreso', 'Coaction', 'ElExpreso', 'RDM',
  'ElExpreso', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-122', 'Monthly External Loss Run - Screamline', 'External', 'Claims',
  'Screamline', 'Coaction', 'Screamline', 'RDM',
  'Screamline', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-123', 'Monthly External Loss Run - Skyline', 'External', 'Claims',
  'Skyline', 'Coaction', 'Skyline', 'RDM',
  'Skyline', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-124', 'Monthly External Loss Run - Tangram', 'External', 'Claims',
  'Tangram', 'Coaction', 'Tangram', 'RDM',
  'Tangram', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-125', 'Monthly External Loss Run - MinnesotaCoach', 'External', 'Claims',
  'MinnesotaCoach', 'Coaction', 'MinnesotaCoach', 'RDM',
  'MinnesotaCoach', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-126', 'Monthly External Loss Run - Fairview', 'External', 'Claims',
  'Fairview', 'Coaction', 'Fairview', 'RDM',
  'Fairview', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-127', 'Monthly External Loss Run - RBJones', 'External', 'Claims',
  'RBJones', 'Coaction', 'RBJones', 'RDM',
  'RBJones', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-128', 'Monthly External Loss Run - RiskPoint', 'External', 'Claims',
  'RiskPoint', 'Coaction', 'RiskPoint', 'RDM',
  'RiskPoint', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-129', 'Monthly External Loss Run - ParkingFacilities', 'External', 'Claims',
  'ParkingFacilities', 'Coaction', 'ParkingFacilities', 'RDM',
  'ParkingFacilities', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-130', 'Monthly External Loss Run - Petrosure', 'External', 'Claims',
  'Petrosure', 'Coaction', 'Petrosure', 'RDM',
  'Petrosure', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-131', 'Monthly External Loss Run - MotorCoach', 'External', 'Claims',
  'MotorCoach', 'Coaction', 'MotorCoach', 'RDM',
  'MotorCoach', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-132', 'Monthly External Loss Run - LandmarkStudentTransportation', 'External', 'Claims',
  'LandmarkStudentTransportation', 'Coaction', 'LandmarkStudentTransportation', 'RDM',
  'LandmarkStudentTransportation', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-133', 'Monthly External Loss Run - InsuredSafewayTransportation', 'External', 'Claims',
  'InsuredSafewayTransportation', 'Coaction', 'InsuredSafewayTransportation', 'RDM',
  'InsuredSafewayTransportation', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-134', 'Monthly External Loss Run - AmericanStudentTransportation', 'External', 'Claims',
  'AmericanStudentTransportation', 'Coaction', 'AmericanStudentTransportation', 'RDM',
  'AmericanStudentTransportation', 'Email', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-135', 'Anaplan (Unearned Premium) Extract', 'External', 'Policy',
  'Coaction', 'Coaction', 'Coaction', 'EDW (Prosight_data, Prosight_EDW)',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-136', 'ImageRight Monthly Report', 'Internal', 'Workflow',
  'Coaction', 'Coaction', 'Coaction', 'ImageRight DB',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-137', 'Avalon Monthly Report', 'External', 'Policy',
  'Coaction', 'Coaction', 'Coaction', 'Premiere Submission',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-138', 'Gross Loss As of Extract', 'Internal', 'Claim',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-139', 'Gross Loss Transaction Extract', 'Internal', 'Claim',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-140', 'Gross Premium Transaction Extract', 'Internal', 'Policy',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-141', 'Earned_Unearned_Premium Report', 'Internal', 'Policy',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-142', 'Captive Weekly Premium Report', 'External', 'Policy',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-143', 'Captive Weekly Loss Report', 'External', 'Claim',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-144', 'Captive Monthly Premium Report', 'External', 'Policy',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-145', 'Captive Monthly Loss Report', 'External', 'Claim',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-146', 'Captive Quarterly Premium Report', 'External', 'Policy',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-147', 'Captive Quarterly Loss Report', 'External', 'Claim',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-148', 'Nexus Feed (Policy-PP & BDX)', 'External', 'Policy',
  'Nexus', 'Coaction', 'Nexus', 'RDM',
  'Nexus', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-149', 'Nexus Feed (Claims)', 'External', 'Claims',
  'Nexus', 'Coaction', 'Nexus', 'RDM',
  'Nexus', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-150', 'Nexus Feed (Policy-BA)', 'External', 'Policy',
  'Nexus', 'Coaction', 'Nexus', 'ClarionDoor',
  'Nexus', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-151', 'Subrogation Weekly Feed', 'External', 'Claims',
  'Paragon', 'Coaction', 'Paragon', 'RDM',
  'Paragon', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-152', 'Subrogation Weekly Feed', 'External', 'Policy',
  'Paragon', 'Coaction', 'Paragon', 'RDM',
  'Paragon', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-153', 'OFAC Quarterly Batch Scans A', 'External', 'Policy',
  'CSI', 'Coaction', 'CSI', 'RDM',
  'CSI', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-154', 'OFAC Quarterly Batch Scans B', 'External', 'Producer',
  'CSI', 'Coaction', 'CSI', 'Premiere Submission',
  'CSI', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-155', 'OFAC Quarterly Batch Scans B', 'External', 'Account',
  'CSI', 'Coaction', 'CSI', 'RDM',
  'CSI', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-156', 'Perr and Knight', 'External', 'Premium',
  'Perr and Knight', 'Coaction', 'Perr and Knight', 'RDM',
  'Perr and Knight', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-157', 'Perr and Knight', 'External', 'Claim Reserves/Payments',
  'Perr and Knight', 'Coaction', 'Perr and Knight', 'RDM',
  'Perr and Knight', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-158', 'Perr and Knight', 'External', 'Claims',
  'Perr and Knight', 'Coaction', 'Perr and Knight', 'RDM',
  'Perr and Knight', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-159', 'E&S property monthly extract', 'Internal', 'Exposure',
  'CAT Modeling team', 'Coaction', 'Coaction', 'SOV/ICM',
  'CAT Modeling team', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-160', 'Standard commercial property extract', 'Internal', 'Exposure',
  'CAT Modeling team', 'Coaction', 'Coaction', 'Premiere Submission',
  'CAT Modeling team', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-161', 'Binding Authority property extract', 'Internal', 'Exposure',
  'CAT Modeling team', 'Coaction', 'Coaction', 'ClarionDoor',
  'CAT Modeling team', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-162', 'Bordereaux monthly property extract', 'Internal', 'Exposure',
  'CAT Modeling team', 'Coaction', 'Coaction', 'ABS_DB ',
  'CAT Modeling team', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-163', 'Inland Marine monthly extract', 'Internal', 'Exposure',
  'CAT Modeling team', 'Coaction', 'Coaction', 'Premiere Submission',
  'CAT Modeling team', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-164', 'APD Monthly extract', 'Internal', 'Exposure',
  'CAT Modeling team', 'Coaction', 'Coaction', 'Premiere Submission',
  'CAT Modeling team', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-165', 'Binding Authority Daily Data extract', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-166', 'Vertical VP Data Extract', 'Internal', 'Claims',
  'Coaction', 'Coaction', 'Coaction', 'RDM',
  'Coaction', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-167', 'WC Unit Stat', 'External', 'Claims',
  'Coaction', 'Coaction', 'Coaction', NULL,
  NULL, 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-168', 'HSB', 'External', 'Claims',
  'Coaction', 'Coaction', 'Coaction', NULL,
  NULL, 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);

INSERT INTO coaction_feed_inventory (
  feed_id, feed_name, feed_type, business_domain,
  data_owner, product_owner, data_source, source_system,
  vendor_partner, transfer_method, file_format, encryption,
  contains_pii, masking, data_provisioned_to_gp, date_provisioned,
  access, credentials, jira, version,
  environment, last_change_date, comments
) VALUES (
  'F-169', 'CVALIR', 'External', 'Compliance',
  'Verisk', 'Coaction', 'Verisk', 'RDM',
  'Verisk', 'File Share', NULL, 'No',
  FALSE, FALSE, FALSE, NULL,
  NULL, NULL, NULL, '1',
  'Prod', NULL, NULL
);


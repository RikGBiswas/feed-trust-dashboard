const pool = require("../db");

// ── helpers ──────────────────────────────────────────────────────────
function yesNoToBool(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.toLowerCase() === "yes";
  return false;
}

function boolToYesNo(val) {
  return val ? "Yes" : "No";
}

function parseDate(val) {
  if (!val || val === "—" || val === "-") return null;
  return val;
}

function rowToFeed(row) {
  return {
    id: row.id,
    feedId: row.feed_id,
    feedName: row.feed_name,
    feedDescription: row.feed_description || "",
    feedType: row.feed_type || "",
    businessDomain: row.business_domain || "",
    dataOwner: row.data_owner || "",
    productOwner: row.product_owner || "",
    dataSource: row.data_source || "",
    sourceSystem: row.source_system || "",
    vendorPartner: row.vendor_partner || "",
    transferMethod: row.transfer_method || "",
    fileFormat: row.file_format || "",
    encryption: row.encryption || "",
    containsPII: boolToYesNo(row.contains_pii),
    masking: boolToYesNo(row.masking),
    provisionedToGP: boolToYesNo(row.data_provisioned_to_gp),
    dateProvisioned: row.date_provisioned || "",
    jira: row.jira || "",
    credentials: row.credentials || "",
    accessOwners: row.access_owners || "",
    accessType: row.access_type || "",
    lastChangeDate: row.last_change_date || "",
    version: row.version || "",
    environment: row.environment || "DEV",
    comments: row.comments || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── GET /api/feeds ───────────────────────────────────────────────────
exports.getAllFeeds = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM coaction_feed_inventory ORDER BY created_at DESC"
    );
    res.json(rows.map(rowToFeed));
  } catch (err) {
    console.error("getAllFeeds error:", err);
    res.status(500).json({ error: "Failed to retrieve feeds" });
  }
};

// ── GET /api/feeds/kpis/summary ──────────────────────────────────────
exports.getKpiSummary = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int                                                  AS "totalFeeds",
        COUNT(*) FILTER (WHERE data_source = 'Third Party')::int       AS "thirdPartyFeeds",
        COUNT(*) FILTER (WHERE data_source = 'CoAction')::int          AS "coactionInternalFeeds",
        COUNT(*) FILTER (WHERE contains_pii = true)::int               AS "feedsWithPii",
        COUNT(*) FILTER (WHERE masking = true)::int                    AS "maskedFeeds",
        COUNT(*) FILTER (WHERE data_provisioned_to_gp = true)::int     AS "feedsProvisionedToGp",
        COUNT(*) FILTER (WHERE jira IS NOT NULL AND jira <> '')::int   AS "feedsWithJira",
        COUNT(*) FILTER (WHERE transfer_method = 'SFTP')::int          AS "sftpFeeds"
      FROM coaction_feed_inventory
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("getKpiSummary error:", err);
    res.status(500).json({ error: "Failed to retrieve KPI summary" });
  }
};

// ── GET /api/feeds/:id ───────────────────────────────────────────────
exports.getFeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM coaction_feed_inventory WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Feed not found" });
    }
    res.json(rowToFeed(rows[0]));
  } catch (err) {
    console.error("getFeedById error:", err);
    res.status(500).json({ error: "Failed to retrieve feed" });
  }
};

// ── POST /api/feeds ──────────────────────────────────────────────────
exports.createFeed = async (req, res) => {
  try {
    const b = req.body;

    // Validate required fields
    if (!b.feedId || !b.feedName) {
      return res
        .status(400)
        .json({ error: "feed_id and feed_name are required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO coaction_feed_inventory (
        feed_id, feed_name, feed_description, feed_type,
        business_domain, data_owner, product_owner, data_source,
        source_system, vendor_partner, transfer_method, file_format,
        encryption, contains_pii, masking, data_provisioned_to_gp,
        date_provisioned, jira, credentials, access_owners,
        access_type, last_change_date, version, environment, comments
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      ) RETURNING *`,
      [
        b.feedId,
        b.feedName,
        b.feedDescription || null,
        b.feedType || null,
        b.businessDomain || null,
        b.dataOwner || null,
        b.productOwner || null,
        b.dataSource || null,
        b.sourceSystem || null,
        b.vendorPartner || null,
        b.transferMethod || null,
        b.fileFormat || null,
        b.encryption || null,
        yesNoToBool(b.containsPII),
        yesNoToBool(b.masking),
        yesNoToBool(b.provisionedToGP),
        parseDate(b.dateProvisioned),
        b.jira || null,
        b.credentials || null,
        b.accessOwners || null,
        b.accessType || null,
        parseDate(b.lastChangeDate),
        b.version || null,
        b.environment || "DEV",
        b.comments || null,
      ]
    );

    res.status(201).json(rowToFeed(rows[0]));
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "A feed with this feed_id already exists" });
    }
    console.error("createFeed error:", err);
    res.status(500).json({ error: "Failed to create feed" });
  }
};

// ── PUT /api/feeds/:id ───────────────────────────────────────────────
exports.updateFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const { rows } = await pool.query(
      `UPDATE coaction_feed_inventory SET
        feed_id              = COALESCE($1,  feed_id),
        feed_name            = COALESCE($2,  feed_name),
        feed_description     = COALESCE($3,  feed_description),
        feed_type            = COALESCE($4,  feed_type),
        business_domain      = COALESCE($5,  business_domain),
        data_owner           = COALESCE($6,  data_owner),
        product_owner        = COALESCE($7,  product_owner),
        data_source          = COALESCE($8,  data_source),
        source_system        = COALESCE($9,  source_system),
        vendor_partner       = COALESCE($10, vendor_partner),
        transfer_method      = COALESCE($11, transfer_method),
        file_format          = COALESCE($12, file_format),
        encryption           = COALESCE($13, encryption),
        contains_pii         = $14,
        masking              = $15,
        data_provisioned_to_gp = $16,
        date_provisioned     = $17,
        jira                 = COALESCE($18, jira),
        credentials          = COALESCE($19, credentials),
        access_owners        = COALESCE($20, access_owners),
        access_type          = COALESCE($21, access_type),
        last_change_date     = $22,
        version              = COALESCE($23, version),
        environment          = COALESCE($24, environment),
        comments             = COALESCE($25, comments)
      WHERE id = $26
      RETURNING *`,
      [
        b.feedId || null,
        b.feedName || null,
        b.feedDescription || null,
        b.feedType || null,
        b.businessDomain || null,
        b.dataOwner || null,
        b.productOwner || null,
        b.dataSource || null,
        b.sourceSystem || null,
        b.vendorPartner || null,
        b.transferMethod || null,
        b.fileFormat || null,
        b.encryption || null,
        yesNoToBool(b.containsPII),
        yesNoToBool(b.masking),
        yesNoToBool(b.provisionedToGP),
        parseDate(b.dateProvisioned),
        b.jira || null,
        b.credentials || null,
        b.accessOwners || null,
        b.accessType || null,
        parseDate(b.lastChangeDate),
        b.version || null,
        b.environment || null,
        b.comments || null,
        id,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Feed not found" });
    }

    res.json(rowToFeed(rows[0]));
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "A feed with this feed_id already exists" });
    }
    console.error("updateFeed error:", err);
    res.status(500).json({ error: "Failed to update feed" });
  }
};

// ── DELETE /api/feeds/:id ────────────────────────────────────────────
exports.deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      "DELETE FROM coaction_feed_inventory WHERE id = $1",
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Feed not found" });
    }
    res.json({ message: "Feed deleted successfully" });
  } catch (err) {
    console.error("deleteFeed error:", err);
    res.status(500).json({ error: "Failed to delete feed" });
  }
};

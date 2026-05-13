const pool = require("../db");

// ── Helpers ──────────────────────────────────────────────────────────
function boolToYesNo(val) {
  return val ? "Yes" : "No";
}

function yesNoToBool(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.toLowerCase() === "yes";
  return false;
}

function rowToDataSource(row) {
  return {
    id: row.id,
    dataSourceName: row.data_source_name || "",
    serverName: row.server_name || "",
    environment: row.environment || "",
    databaseType: row.database_type || "",
    status: row.status || "",
    recoveryModel: row.recovery_model || "",
    legacyOrNew: row.legacy_or_new || "",
    accessLevel: row.access_level || "",
    containsPII: boolToYesNo(row.contains_pii),
    dataMasking: boolToYesNo(row.data_masking),
    provisionedToGP: boolToYesNo(row.provisioned_to_gp),
    dateProvisioned: row.date_provisioned || "",
    jira: row.jira || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── GET /api/data-sources ────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM stage.coaction_feed_data_sources ORDER BY id ASC"
    );
    res.json(rows.map(rowToDataSource));
  } catch (err) {
    console.error("getDataSources error:", err);
    res.status(500).json({ error: "Failed to retrieve data sources" });
  }
};

// ── GET /api/data-sources/:id ────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM stage.coaction_feed_data_sources WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rowToDataSource(rows[0]));
  } catch (err) {
    console.error("getDataSource error:", err);
    res.status(500).json({ error: "Failed to retrieve data source" });
  }
};

// ── POST /api/data-sources ───────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const b = req.body;
    const { rows } = await pool.query(
      `INSERT INTO stage.coaction_feed_data_sources (
        data_source_name, server_name, environment, database_type,
        status, recovery_model, legacy_or_new, access_level,
        contains_pii, data_masking, provisioned_to_gp, date_provisioned, jira
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *`,
      [
        b.dataSourceName || null,
        b.serverName || null,
        b.environment || null,
        b.databaseType || null,
        b.status || null,
        b.recoveryModel || null,
        b.legacyOrNew || null,
        b.accessLevel || null,
        yesNoToBool(b.containsPII),
        yesNoToBool(b.dataMasking),
        yesNoToBool(b.provisionedToGP),
        b.dateProvisioned || null,
        b.jira || null,
      ]
    );
    res.status(201).json(rowToDataSource(rows[0]));
  } catch (err) {
    console.error("createDataSource error:", err);
    res.status(500).json({ error: "Failed to create data source" });
  }
};

// ── PUT /api/data-sources/:id ────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const b = req.body;
    const id = req.params.id;
    const { rows } = await pool.query(
      `UPDATE stage.coaction_feed_data_sources SET
        data_source_name = $1, server_name = $2, environment = $3,
        database_type = $4, status = $5, recovery_model = $6,
        legacy_or_new = $7, access_level = $8,
        contains_pii = $9, data_masking = $10, provisioned_to_gp = $11,
        date_provisioned = $12, jira = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *`,
      [
        b.dataSourceName ?? "",
        b.serverName ?? "",
        b.environment ?? "",
        b.databaseType ?? "",
        b.status ?? "",
        b.recoveryModel ?? "",
        b.legacyOrNew ?? "",
        b.accessLevel ?? "",
        yesNoToBool(b.containsPII),
        yesNoToBool(b.dataMasking),
        yesNoToBool(b.provisionedToGP),
        b.dateProvisioned || null,
        b.jira || null,
        id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rowToDataSource(rows[0]));
  } catch (err) {
    console.error("updateDataSource error:", err);
    res.status(500).json({ error: "Failed to update data source" });
  }
};

// ── DELETE /api/data-sources/:id ─────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM stage.coaction_feed_data_sources WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteDataSource error:", err);
    res.status(500).json({ error: "Failed to delete data source" });
  }
};

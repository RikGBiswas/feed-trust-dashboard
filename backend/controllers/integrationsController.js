const pool = require("../db");

// ── Helpers ──────────────────────────────────────────────────────────
function rowToIntegration(row) {
  return {
    id: row.id,
    domain: row.domain || "",
    sourceSystem: row.source_system || "",
    sourcePlatform: row.source_platform || "",
    integrationInterface: row.integration_interface || "",
    targetSystem: row.target_system || "",
    targetLayer: row.target_layer || "",
    targetPlatform: row.target_platform || "",
    feedType: row.feed_type || "",
    frequency: row.frequency || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── GET /api/integrations ────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM stage.coaction_feed_data_integrations ORDER BY id ASC"
    );
    res.json(rows.map(rowToIntegration));
  } catch (err) {
    console.error("getIntegrations error:", err);
    res.status(500).json({ error: "Failed to retrieve integrations" });
  }
};

// ── GET /api/integrations/:id ────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM stage.coaction_feed_data_integrations WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rowToIntegration(rows[0]));
  } catch (err) {
    console.error("getIntegration error:", err);
    res.status(500).json({ error: "Failed to retrieve integration" });
  }
};

// ── POST /api/integrations ───────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const b = req.body;
    const { rows } = await pool.query(
      `INSERT INTO stage.coaction_feed_data_integrations (
        domain, source_system, source_platform, integration_interface,
        target_system, target_layer, target_platform, feed_type, frequency
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        b.domain || null,
        b.sourceSystem || null,
        b.sourcePlatform || null,
        b.integrationInterface || null,
        b.targetSystem || null,
        b.targetLayer || null,
        b.targetPlatform || null,
        b.feedType || null,
        b.frequency || null,
      ]
    );
    res.status(201).json(rowToIntegration(rows[0]));
  } catch (err) {
    console.error("createIntegration error:", err);
    res.status(500).json({ error: "Failed to create integration" });
  }
};

// ── PUT /api/integrations/:id ────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const b = req.body;
    const id = req.params.id;
    const { rows } = await pool.query(
      `UPDATE stage.coaction_feed_data_integrations SET
        domain = $1, source_system = $2, source_platform = $3,
        integration_interface = $4, target_system = $5, target_layer = $6,
        target_platform = $7, feed_type = $8, frequency = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *`,
      [
        b.domain ?? "",
        b.sourceSystem ?? "",
        b.sourcePlatform ?? "",
        b.integrationInterface ?? "",
        b.targetSystem ?? "",
        b.targetLayer ?? "",
        b.targetPlatform ?? "",
        b.feedType ?? "",
        b.frequency ?? "",
        id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rowToIntegration(rows[0]));
  } catch (err) {
    console.error("updateIntegration error:", err);
    res.status(500).json({ error: "Failed to update integration" });
  }
};

// ── DELETE /api/integrations/:id ─────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM stage.coaction_feed_data_integrations WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteIntegration error:", err);
    res.status(500).json({ error: "Failed to delete integration" });
  }
};

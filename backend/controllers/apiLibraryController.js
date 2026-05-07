const pool = require("../db");

// ── Helpers ──────────────────────────────────────────────────────────
function rowToApiEntry(row) {
  return {
    id: row.id,
    rowNum: row.row_num || 0,
    exportable: row.exportable || "",
    rowType: row.row_type || "",
    match: row.match || "",
    name: row.name || "",
    description: row.description || "",
    sourceOwner: row.source_owner || "",
    sourceType: row.source_type || "",
    dataSource: row.data_source || "",
    integrationType: row.integration_type || "",
    targetOwner: row.target_owner || "",
    targetType: row.target_type || "",
    target: row.target || "",
    status: row.status || "",
    domain: row.domain || "",
    pointOfContact: row.point_of_contact || "",
    origin: row.origin || "",
    questions: row.questions || "",
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── GET /api/api-library ─────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM stage.coaction_feed_api_library ORDER BY row_num ASC, id ASC"
    );
    res.json(rows.map(rowToApiEntry));
  } catch (err) {
    console.error("getApiLibrary error:", err);
    res.status(500).json({ error: "Failed to retrieve API library" });
  }
};

// ── GET /api/api-library/:id ─────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM stage.coaction_feed_api_library WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rowToApiEntry(rows[0]));
  } catch (err) {
    console.error("getApiEntry error:", err);
    res.status(500).json({ error: "Failed to retrieve API entry" });
  }
};

// ── POST /api/api-library ────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const b = req.body;
    const { rows } = await pool.query(
      `INSERT INTO stage.coaction_feed_api_library (
        row_num, exportable, row_type, match, name, description,
        source_owner, source_type, data_source, integration_type,
        target_owner, target_type, target, status, domain,
        point_of_contact, origin, questions, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING *`,
      [
        b.rowNum || null,
        b.exportable || null,
        b.rowType || null,
        b.match || null,
        b.name || null,
        b.description || null,
        b.sourceOwner || null,
        b.sourceType || null,
        b.dataSource || null,
        b.integrationType || null,
        b.targetOwner || null,
        b.targetType || null,
        b.target || null,
        b.status || null,
        b.domain || null,
        b.pointOfContact || null,
        b.origin || null,
        b.questions || null,
        b.notes || null,
      ]
    );
    res.status(201).json(rowToApiEntry(rows[0]));
  } catch (err) {
    console.error("createApiEntry error:", err);
    res.status(500).json({ error: "Failed to create API entry" });
  }
};

// ── PUT /api/api-library/:id ─────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const b = req.body;
    const id = req.params.id;
    const { rows } = await pool.query(
      `UPDATE stage.coaction_feed_api_library SET
        row_num = $1, exportable = $2, row_type = $3, match = $4,
        name = $5, description = $6, source_owner = $7, source_type = $8,
        data_source = $9, integration_type = $10, target_owner = $11,
        target_type = $12, target = $13, status = $14, domain = $15,
        point_of_contact = $16, origin = $17, questions = $18, notes = $19,
        updated_at = NOW()
      WHERE id = $20
      RETURNING *`,
      [
        b.rowNum ?? 0,
        b.exportable ?? "",
        b.rowType ?? "",
        b.match ?? "",
        b.name ?? "",
        b.description ?? "",
        b.sourceOwner ?? "",
        b.sourceType ?? "",
        b.dataSource ?? "",
        b.integrationType ?? "",
        b.targetOwner ?? "",
        b.targetType ?? "",
        b.target ?? "",
        b.status ?? "",
        b.domain ?? "",
        b.pointOfContact ?? "",
        b.origin ?? "",
        b.questions ?? "",
        b.notes ?? "",
        id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rowToApiEntry(rows[0]));
  } catch (err) {
    console.error("updateApiEntry error:", err);
    res.status(500).json({ error: "Failed to update API entry" });
  }
};

// ── DELETE /api/api-library/:id ──────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM stage.coaction_feed_api_library WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteApiEntry error:", err);
    res.status(500).json({ error: "Failed to delete API entry" });
  }
};

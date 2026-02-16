import express from "express";
import Lead from "../models/Lead.js";

import validateLead from "../middleware/validateLead.js";

const router = express.Router();

// POST /api/leads
router.post("/", validateLead, async (req, res) => {
  try {
    const { name, email, consulta } = req.body;

    const newLead = new Lead({
      name,
      email,
      consulta,
    });

    await newLead.save();

    return res.status(201).json({
      success: true,
      message: "Lead guardado correctamente",
    });

  } catch (error) {

    
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export default router;

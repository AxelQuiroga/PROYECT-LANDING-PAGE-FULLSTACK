import express from "express";
import Lead from "../models/Lead.js";

import validateLead from "../middleware/validateLead.js";

const router = express.Router();

// POST /api/leads
router.post("/", validateLead, async (req, res) => {
  try {
    const { name, email, consulta } = req.body;

    const existingLeadsCount = await Lead.countDocuments({ email });
    const maxSubmissionsPerEmail = 3;

    if (existingLeadsCount >= maxSubmissionsPerEmail) {
      return res.status(429).json({
        success: false,
        message: "Este email ya alcanzo el limite de 3 envios.",
      });
    }

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

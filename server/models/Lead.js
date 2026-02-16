import mongoose from "mongoose";

// Definición del esquema
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      trim: true,
      lowercase: true,

      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    consulta: {
      type: String,
      required: [true, "La consulta es obligatoria"],
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Crear modelo
const Lead = mongoose.model("Lead", leadSchema);

export default Lead;


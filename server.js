import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./server/config/db.js";
import leadsRouter from "./server/routes/leads.js";
import apiLimiter from "./server/middleware/rateLimiter.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Conectar base de datos
connectDB();

//middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//ruta api
app.use("/api", apiLimiter);
app.use("/api/leads", leadsRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

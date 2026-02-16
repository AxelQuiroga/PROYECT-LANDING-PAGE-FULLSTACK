import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 requests por IP
  message: {
    success: false,
    message: "Demasiadas solicitudes desde esta IP. Intenta más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiLimiter;

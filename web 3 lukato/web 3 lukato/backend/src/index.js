import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import faucetRoutes from "./routes/faucet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use("/auth", authRoutes);
app.use("/faucet", faucetRoutes);

// Ruta de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "CryptoFaucet API - Sistema Operativo",
    timestamp: new Date().toISOString(),
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    name: "CryptoFaucet API",
    version: "1.0.0",
    description:
      "API REST con autenticación Web3 (SIWE) para distribuir tokens en Sepolia",
    endpoints: {
      auth: {
        "POST /auth/message":
          "Genera un mensaje SIWE para firmar con tu wallet",
        "POST /auth/signin": "Verifica la firma y genera un token JWT",
        "GET /auth/verify": "Verifica la validez de tu token JWT",
      },
      faucet: {
        "POST /faucet/claim": "Solicita tus tokens (autenticación requerida)",
        "GET /faucet/status/:address":
          "Consulta el estado de tu cuenta (autenticación requerida)",
        "GET /faucet/info": "Obtén información general del sistema",
      },
    },
  });
});

// Manejador de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint no encontrado",
    message: `La ruta ${req.method} ${req.path} no está disponible`,
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({
    error: "Error interno del servidor",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Ha ocurrido un error inesperado",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🔗 Conectado a Sepolia vía ${process.env.RPC_URL}`);
  console.log(`📜 Smart Contract: ${process.env.CONTRACT_ADDRESS}`);
  console.log(
    `🌐 Frontend permitido: ${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }`
  );
});

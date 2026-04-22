import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dbRouter from "./routes/dbRoute.js";
import mainRouter from "./routes/mainRoute.js";
import generatorRouter from "./routes/generatorRoute.js";
import { connect } from "./config/db.js";
import morgan from "morgan";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// security & logs (optional but recommended)
app.use(helmet());
app.use(morgan("dev"));

// static
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/vendor/plotly.js", express.static(path.join(__dirname, "..", "node_modules", "plotly.js-dist", "plotly.js")));
app.use("/vendor/easymde", express.static(path.join(__dirname, "..", "node_modules", "easymde", "dist")));
app.use("/vendor/font-awesome", express.static(path.join(__dirname, "..", "node_modules", "font-awesome")));

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/", dbRouter);
app.use("/", mainRouter);
app.use("/", generatorRouter);
app.get("/api/ping", (req, res) => res.send("pong"));

// centralized error handler (must be last before listen)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
});

// start after DB is connected
const start = async () => {
  try {
    await connect();
    app.listen(PORT, HOST, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();

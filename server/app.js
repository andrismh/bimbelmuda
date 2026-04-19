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

app.use(helmet());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensure DB is connected on every cold start (cached after first call)
app.use(async (req, res, next) => {
  try {
    await connect();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/", dbRouter);
app.use("/", mainRouter);
app.use("/", generatorRouter);
app.get("/api/ping", (req, res) => res.send("pong"));

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// only start listener in local dev — Vercel manages its own runtime
if (!process.env.VERCEL) {
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
}

export default app;

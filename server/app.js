import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dbRouter from "./routes/dbRoute.js";
import mainRouter from "./routes/mainRoute.js";
import { connect } from "./config/db.js"; // <-- use your connect helper
import morgan from "morgan";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// security & logs (optional but recommended)
app.use(helmet());
app.use(morgan("dev"));

// static
app.use(express.static(path.join(__dirname, "../", "public")));

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/", dbRouter);
app.use("/", mainRouter);

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
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();

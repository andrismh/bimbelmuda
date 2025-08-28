import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayout from "express-ejs-layouts";
import mongoose from "mongoose";
import dbRouter from "./routes/dbRoute.js";
import mainRouter from "./routes/mainRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// set the static file path
app.use(express.static(path.join(__dirname, "../", "public")));

// Set the parser
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For Application data

// Set the express layout
app.use(expressLayout);
app.set('layout', path.join(path.dirname(__dirname), "views/layouts/main"));

// Set the ejs engine
app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(__dirname), "views"));

// Set the Route
app.use('/api/posts', dbRouter);
app.use('/', mainRouter);

app.get('/', (req, res) => {
  res.render('pages/index', {
    title: "Bimbel Muda!"
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.get("/", (req, res) => {
    res.render("index", {
        name: "Mood"
    });
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/static/about.html"));
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.listen(port, () =>{
    console.log(`Server running on port ${port}.`);
}); 
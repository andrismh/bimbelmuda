import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/about.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../about.html"));
});

app.listen(port, () =>{
    console.log(`Server running on port ${port}.`);
});
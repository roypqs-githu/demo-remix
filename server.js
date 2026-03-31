const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

// 🔐 TUS DATOS OPENDRIVE
const USER = "TU_USUARIO";
const PASS = "TU_PASSWORD";

// Servir frontend
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📁 LISTAR ARCHIVOS (WebDAV)
app.get("/list", (req, res) => {
    const folder = req.query.path || "/";

    request({
        method: "PROPFIND",
        url: "https://webdav.opendrive.com" + folder,
        auth: {
            user: USER,
            pass: PASS
        },
        headers: {
            Depth: 1
        }
    }, (err, response, body) => {
        res.send(body);
    });
});

// 🎧 STREAM (CORREGIDO 🔥)
app.get("/stream", (req, res) => {
    const fileUrl = decodeURIComponent(req.query.url);

    request({
        url: fileUrl,
        auth: {
            user: USER,
            pass: PASS
        },
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    }).pipe(res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});

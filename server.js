const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

// 🔐 TUS DATOS OPENDRIVE (OBLIGATORIO)
const USER = "roy.pqs@icloud.com";
const PASS = "Sonido2k24";

// Servir frontend
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📁 LISTAR ARCHIVOS (CORREGIDO 🔥)
app.get("/list", (req, res) => {

    const folder = decodeURIComponent(req.query.path || "/");

    request({
        method: "PROPFIND",
        url: "https://webdav.opendrive.com" + folder,
        headers: {
            Depth: 1
        },
        auth: {
            user: USER,
            pass: PASS,
            sendImmediately: true // 🔥 CLAVE
        }
    }, (err, response, body) => {

        if (err) {
            return res.send("ERROR: " + err.message);
        }

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
            pass: PASS,
            sendImmediately: true // 🔥 CLAVE
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

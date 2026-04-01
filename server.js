const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

// 🔐 TUS DATOS OPENDRIVE
const USER = "roy.pqs@icloud.com";
const PASS = "Sonido2k24";

// servir frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📁 LISTAR ARCHIVOS (WebDAV)
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
            sendImmediately: true
        }
    }, (err, response, body) => {

        if (err) {
            return res.send("ERROR LIST");
        }

        res.send(body);
    });
});

// 🎧 STREAM (audio/video)
app.get("/stream", (req, res) => {

    const fileUrl = decodeURIComponent(req.query.url);

    request({
        url: fileUrl,
        auth: {
            user: USER,
            pass: PASS,
            sendImmediately: true
        },
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    })
    .on("response", (response) => {

        // 🔥 headers importantes para streaming
        res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Cache-Control", "no-cache");

    })
    .pipe(res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});

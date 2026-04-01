const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

// 🔐 TUS DATOS
const USER = "roy.pqs@icloud.com";
const PASS = "Sonido2k24";

// frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📁 LISTAR
app.get("/list", (req, res) => {

    const folder = decodeURIComponent(req.query.path || "/");

    request({
        method: "PROPFIND",
        url: "https://webdav.opendrive.com" + folder,
        headers: { Depth: 1 },
        auth: { user: USER, pass: PASS, sendImmediately: true }
    }, (err, response, body) => {

        if (err) return res.send("ERROR LIST");

        res.send(body);
    });
});

// 🎬🎵 STREAM REAL (COMPATIBLE iPhone / Android)
app.get("/stream", (req, res) => {

    const fileUrl = decodeURIComponent(req.query.url);
    const range = req.headers.range;

    const headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
        "Connection": "keep-alive"
    };

    if (range) {
        headers["Range"] = range;
    }

    request({
        url: fileUrl,
        auth: {
            user: USER,
            pass: PASS,
            sendImmediately: true
        },
        headers: headers
    })
    .on("response", (response) => {

        res.writeHead(response.statusCode, {
            "Content-Type": response.headers["content-type"] || "application/octet-stream",
            "Accept-Ranges": "bytes",
            "Content-Length": response.headers["content-length"],
            "Content-Range": response.headers["content-range"],
            "Cache-Control": "no-store"
        });

    })
    .pipe(res);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor listo 🔥");
});

const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

const USER = "TU_USUARIO";
const PASS = "TU_PASSWORD";

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

// 🎬🎵 STREAM CON RANGE (🔥 SOLUCIÓN REAL)
app.get("/stream", (req, res) => {

    const fileUrl = decodeURIComponent(req.query.url);

    const range = req.headers.range;

    const headers = {
        "User-Agent": "Mozilla/5.0"
    };

    if (range) {
        headers["Range"] = range; // 🔥 CLAVE
    }

    const stream = request({
        url: fileUrl,
        auth: {
            user: USER,
            pass: PASS,
            sendImmediately: true
        },
        headers: headers
    });

    stream.on("response", (response) => {

        // 🔥 copiar headers reales
        res.writeHead(response.statusCode, {
            "Content-Type": response.headers["content-type"] || "application/octet-stream",
            "Content-Length": response.headers["content-length"],
            "Accept-Ranges": "bytes",
            "Content-Range": response.headers["content-range"] || undefined
        });

    });

    stream.pipe(res);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor listo 🔥");
});

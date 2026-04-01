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

        if (err) return res.send("ERROR");

        res.send(body);
    });
});

// 🎧 STREAM PRO 🔥
app.get("/stream", (req, res) => {

    const fileUrl = decodeURIComponent(req.query.url);

    request({
        url: fileUrl,
        auth: { user: USER, pass: PASS, sendImmediately: true },
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    })
    .on("response", (response) => {

        // 🔥 headers correctos para streaming
        res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Cache-Control", "no-cache");

    })
    .pipe(res);
});

app.listen(process.env.PORT || 3000);

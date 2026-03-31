const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal (evita error Not Found)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// STREAM (oculta el link real)
app.get("/stream", (req, res) => {
    const fileUrl = decodeURIComponent(req.query.url);

    request({
        url: fileUrl,
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    }).pipe(res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});

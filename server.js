<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Remix Pro DJ DEMO</title>

<style>
body {
    background: #020617;
    color: white;
    font-family: Arial;
    margin: 0;
}

header {
    padding: 15px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 1px solid #1e293b;
}

.nav {
    padding: 10px;
    border-bottom: 1px solid #1e293b;
}

button {
    padding: 8px 12px;
    margin-right: 5px;
    background: #1e293b;
    color: white;
    border: none;
    border-radius: 5px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
    padding: 12px;
}

.card {
    background: #0f172a;
    padding: 12px;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
}

.icon {
    font-size: 28px;
    margin-bottom: 8px;
}

/* PLAYER */
.player-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #020617;
    border-top: 1px solid #1e293b;
    padding: 8px;
}

audio, video {
    width: 100%;
}

body::after {
    content: "";
    display: block;
    height: 120px;
}

/* 📱 MOBILE */
@media (max-width: 600px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>

</head>

<body>

<header>🎧 Remix Pro DJ DEMO</header>

<div class="nav">
    <button onclick="goBack()">⬅ Regresar</button>
    <button onclick="goHome()">🏠 Inicio</button>
</div>

<div id="path" style="padding:10px; color:#94a3b8;"></div>

<div id="explorer" class="grid">Cargando...</div>

<div class="player-bar">

<audio id="audioPlayer" controls controlsList="nodownload"></audio>

<video id="videoPlayer"
controls
playsinline
webkit-playsinline
muted
preload="metadata"
style="display:none; max-height:250px; background:black;">
</video>

</div>

<script>

let ROOT = null;
let historyStack = [];

async function detectRoot() {

    const res = await fetch("/list?path=/");
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const items = xml.getElementsByTagName("d:response");

    for (let i = 0; i < items.length; i++) {

        const href = items[i].getElementsByTagName("d:href")[0].textContent;
        const decoded = decodeURIComponent(href).toLowerCase();

        if (decoded.includes("remix pro dj")) {
            ROOT = href;
            loadFolder(ROOT);
            return;
        }
    }

    document.getElementById("explorer").innerHTML =
        "❌ No se encontró la carpeta Remix Pro DJ";
}

async function loadFolder(path, addToHistory = true) {

    if (addToHistory) historyStack.push(path);

    document.getElementById("path").innerText = decodeURIComponent(path);

    const res = await fetch("/list?path=" + encodeURIComponent(path));
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const items = xml.getElementsByTagName("d:response");

    let html = "";

    for (let i = 0; i < items.length; i++) {

        const href = items[i].getElementsByTagName("d:href")[0].textContent;

        if (href === path) continue;

        const decoded = decodeURIComponent(href);
        const parts = decoded.split("/").filter(Boolean);
        const name = parts[parts.length - 1];

        if (!name || name.startsWith(".")) continue;

        if (href.endsWith("/")) {
            html += `
            <div class="card" onclick="loadFolder('${href}')">
                <div class="icon">📁</div>
                <div>${name}</div>
            </div>`;
        } else {
            html += `
            <div class="card" onclick="playFile('${href}')">
                <div class="icon">🎵</div>
                <div>${name}</div>
            </div>`;
        }
    }

    document.getElementById("explorer").innerHTML =
        html || "⚠️ Carpeta vacía";
}

// 🎬🎵 FIX TOTAL
function playFile(url) {

    const fullUrl = "/stream?url=https://webdav.opendrive.com" + encodeURIComponent(url);

    const audio = document.getElementById("audioPlayer");
    const video = document.getElementById("videoPlayer");

    audio.pause();
    video.pause();

    audio.style.display = "none";
    video.style.display = "none";

    const lower = url.toLowerCase();

    if (lower.endsWith(".mp4")) {

        video.src = fullUrl;
        video.style.display = "block";

        video.load();

        video.play().catch(() => {
            alert("Toca el video para reproducir");
        });

    } else if (lower.endsWith(".mp3")) {

        audio.src = fullUrl;
        audio.style.display = "block";

        audio.load();
        audio.play();

    } else if (lower.endsWith(".flac")) {

        alert("⚠️ FLAC no compatible en iPhone");
    }
}

function goBack() {
    if (historyStack.length > 1) {
        historyStack.pop();
        const prev = historyStack.pop();
        loadFolder(prev);
    }
}

function goHome() {
    historyStack = [];
    if (ROOT) loadFolder(ROOT);
}

detectRoot();

</script>

</body>
</html>

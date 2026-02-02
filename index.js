const express = require('express');
const axios = require('axios');
const yts = require('yt-search');
const app = express();

app.get('/api', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ status: false, error: "Judulnya mana sem?" });

    try {
        // 1. Cari videonya dulu
        const search = await yts(query);
        const vid = search.videos[0];
        if (!vid) return res.json({ status: false, error: "Gak ketemu sem" });

        // 2. Ambil link download (MP3/MP4) pakai Scraper biar gak kena blokir YouTube
        // Kita pakai api pihak ketiga yang stabil
        const dlResult = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${vid.url}`);
        const data = dlResult.data.result;

        // 3. Kirim hasil lengkapnya
        res.json({
            status: "success",
            title: vid.title,
            author: vid.author.name,
            views: vid.views,
            duration: vid.timestamp,
            thumb: vid.thumbnail,
            url_video: vid.url,
            download: {
                mp3: data.mp3, // Link langsung download lagu
                mp4: data.mp4  // Link langsung download video
            }
        });

    } catch (e) {
        res.json({ 
            status: false, 
            error: "Server YouTube lagi sibuk, coba lagi sem!",
            detail: e.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ON port ${PORT}`);
});

module.exports = app;

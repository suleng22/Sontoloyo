const express = require('express');
const yts = require('yt-search');
const app = express();

app.get('/api', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ status: false, error: "Judulnya mana sem?" });

    try {
        const search = await yts(query);
        const vid = search.videos[0];
        if (!vid) return res.json({ status: false, error: "Gak ketemu sem" });

        // Pakai website converter yang stabil buat hasil downloadnya
        const dlLink = `https://www.y2mate.com/youtube/${vid.videoId}`;

        res.json({
            status: "success",
            title: vid.title,
            views: vid.views,
            duration: vid.timestamp,
            url_video: vid.url,
            thumb: vid.thumbnail,
            download_helper: dlLink // Klik link ini buat milih MP3/MP4
        });

    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gaspol sem!`));

module.exports = app;

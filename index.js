const express = require('express');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.get('/api', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ error: "Judulnya mana sem?" });

    try {
        const search = await yts(query);
        const vid = search.videos[0];
        if (!vid) return res.json({ error: "Gak ketemu sem" });

        const info = await ytdl.getInfo(vid.url);
        // Format 18 = MP4 360p (paling stabil buat LINE)
        const format = ytdl.chooseFormat(info.formats, { quality: '18' });

        res.json({
            status: "success",
            title: vid.title,
            url: format.url,
            thumb: vid.thumbnail
        });
    } catch (e) {
        res.json({ error: e.message });
    }
});

app.listen(3000);
module.exports = app;

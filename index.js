const express = require('express');
const yts = require('yt-search');
const app = express();

app.get('/api', async (req, res) => {
    // Menggunakan 'q' sesuai kodinganmu sebelumnya
    const query = req.query.q; 
    if (!query) return res.json({ status: false, error: "Judulnya mana sem?" });

    try {
        // Cari video di YouTube
        const search = await yts(query);
        const vid = search.videos[0];
        
        if (!vid) return res.json({ status: false, error: "Gak ketemu sem" });

        // Balas dengan data yang aman (pasti muncul)
        res.json({
            status: "success",
            title: vid.title,
            views: vid.views,
            timestamp: vid.timestamp,
            ago: vid.ago,
            url: vid.url,
            thumb: vid.thumbnail
        });

    } catch (e) {
        res.json({ status: false, error: e.message });
    }
});

// Sesuaikan port untuk Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server jalan di port ${PORT}`);
});

module.exports = app;

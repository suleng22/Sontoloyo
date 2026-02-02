const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Masukkan judul lagu sem!" });

  try {
    // 1. Cari video
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = search.data.result[0];

    // 2. Ambil link MP4 asli (BIAR BISA DI-PLAY)
    const dl = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    
    res.json({
      status: "success",
      title: video.title,
      urlVideo: dl.data.result.mp4, // INI KUNCINYA
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "API lagi pening sem" });
  }
};

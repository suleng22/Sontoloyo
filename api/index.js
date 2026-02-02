const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Masukkan judul lagu sem!" });

  try {
    // 1. CARI INFO VIDEO
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = search.data.result[0];

    // 2. TUKAR LINK YT JADI FILE MP4 (Ini kuncinya agar bisa di-play)
    const download = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    
    // 3. KIRIM HASIL KE BOT
    res.json({
      status: "success",
      title: video.title,
      urlVideo: download.data.result.mp4, // <--- Link ini yang bisa diputar di LINE
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "Gagal ambil video sem" });
  }
};

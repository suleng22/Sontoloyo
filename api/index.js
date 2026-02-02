const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Judulnya mana sem?" });

  try {
    // 1. CARI VIDEO
    const searchRes = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = searchRes.data.result[0];

    // 2. AMBIL LINK MP4 (Wajib agar bisa di-play)
    const dlRes = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    
    // 3. KIRIM BALIK
    res.json({
      status: "success",
      title: video.title,
      duration: video.timestamp,
      urlVideo: dlRes.data.result.mp4, // INI HARUS LINK .MP4
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "API lagi pening sem" });
  }
};

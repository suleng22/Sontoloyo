const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Masukkan judul lagu sem!" });

  try {
    // 1. CARI VIDEO
    const searchRes = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = searchRes.data.result[0];

    if (!video) return res.json({ status: "error", message: "Gak ketemu sem!" });

    // 2. AMBIL LINK MP4 DIRECT (Kunci biar bisa di-play di LINE)
    const dlRes = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    const directMp4 = dlRes.data.result.mp4;

    // 3. KIRIM BALIK KE BOT GO
    res.json({
      status: "success",
      title: video.title,
      duration: video.timestamp,
      urlVideo: directMp4, // Link ini sekarang isinya file .mp4 asli
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "API Vreden lagi pusing sem!" });
  }
};

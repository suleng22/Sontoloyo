const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Query kosong sem!" });

  try {
    // 1. Cari video di YT
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = search.data.result[0];
    if (!video) return res.json({ status: "error", message: "Gak ketemu sem!" });

    // 2. AMBIL LINK MP4 DIRECT (Kunci agar bisa di-play)
    const dl = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    const directLink = dl.data.result.mp4;

    // 3. Kirim balik ke Bot Go
    res.json({
      status: "success",
      title: video.title,
      views: video.views,
      duration: video.timestamp,
      urlVideo: directLink, // Sekarang isinya link .mp4 asli
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "API Vreden lagi pusing sem!" });
  }
};

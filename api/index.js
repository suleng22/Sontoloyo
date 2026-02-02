const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Query kosong sem!" });

  try {
    // 1. Cari video di YT lewat API Vreden
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const result = search.data.result[0];

    if (!result) return res.json({ status: "error", message: "Gak ketemu sem!" });

    // 2. Ambil Link Mentah (.mp4) BIAR BISA DI-PLAY
    // Ini langkah wajib agar LINE tidak cuma nampilin gambar
    const download = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${result.url}`);
    const videoDirect = download.data.result.mp4;

    // 3. Kirim ke Bot Go
    res.json({
      status: "success",
      title: result.title,
      duration: result.timestamp,
      views: result.views,
      urlVideo: videoDirect, // <--- Sekarang isinya link .mp4 asli
      thumb: result.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "API Vreden lagi pening sem!" });
  }
};

const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Query kosong sem!" });

  try {
    // 1. Cari video di YT
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const result = search.data.result[0];

    if (!result) return res.json({ status: "error", message: "Gak ketemu sem!" });

    // 2. Ambil Link Mentah (Direct MP4)
    // Ini kunci biar video bisa di-play di LINE
    const download = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${result.url}`);
    const videoDirect = download.data.result.mp4;

    // 3. Kirim ke Bot Go
    res.json({
      status: "success",
      title: result.title,
      duration: result.timestamp,
      views: result.views,
      urlVideo: videoDirect, // Link MP4 yang sudah matang
      thumb: result.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

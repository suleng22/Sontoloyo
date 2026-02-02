const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Judulnya apa sem?" });

  try {
    // 1. Cari video di YT lewat API Vreden
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = search.data.result[0];

    if (!video) return res.json({ status: "error", message: "Gak ketemu sem!" });

    // 2. AMBIL LINK MP4 (Biar bisa di-play, bukan cuma gambar)
    const dl = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    const videoDirect = dl.data.result.mp4;

    // 3. Kirim data ke bot Go kamu
    res.json({
      status: "success",
      title: video.title,
      duration: video.timestamp,
      urlVideo: videoDirect, // <--- Ini yang bikin video bisa di-play
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "Server lagi pening sem!" });
  }
};

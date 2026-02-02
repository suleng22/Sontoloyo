const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Masukkan query!" });

  try {
    // 1. Cari video di YouTube
    const searchUrl = `https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`;
    const searchRes = await axios.get(searchUrl);
    const video = searchRes.data.result[0];

    if (!video) return res.json({ status: "error", message: "Video tidak ditemukan" });

    // 2. AMBIL LINK MP4 DIRECT (Paling Penting!)
    const dlUrl = `https://api.vreden.my.id/api/ytdl?url=${video.url}`;
    const dlRes = await axios.get(dlUrl);
    const videoDirect = dlRes.data.result.mp4;

    // 3. Kirim data ke bot Go kamu
    res.json({
      status: "success",
      title: video.title,
      views: video.views,
      duration: video.timestamp,
      urlVideo: videoDirect, // Link ini yang bakal bikin video bisa di-play
      thumb: video.thumbnail,
      urlYoutube: video.url
    });
  } catch (e) {
    res.json({ status: "error", message: e.message });
  }
};

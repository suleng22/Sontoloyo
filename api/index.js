const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Masukkan judul lagu sem!" });

  try {
    // 1. Cari video di YouTube
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = search.data.result[0];

    if (!video) return res.json({ status: "error", message: "Video gak ketemu sem!" });

    // 2. Ambil Link Direct MP4 (Wajib agar bisa di-play di LINE)
    const dl = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    const linkMentah = dl.data.result.mp4;

    // 3. Kirim balik ke bot Go
    res.json({
      status: "success",
      title: video.title,
      views: video.views,
      duration: video.timestamp,
      urlVideo: linkMentah, // Link ini yang akan diputar oleh fungsi VGede
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "API Vreden lagi down sem!" });
  }
};

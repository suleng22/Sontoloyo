const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Isi judulnya sem" });

  try {
    // Cari video
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = search.data.result[0];
    if (!video) return res.json({ status: "error" });

    // AMBIL LINK MP4 (Wajib biar bisa di-play)
    const dl = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    
    // Kirim balik ke bot Go
    res.json({
      status: "success",
      title: video.title,
      duration: video.timestamp,
      urlVideo: dl.data.result.mp4, // INI HARUS LINK .MP4
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

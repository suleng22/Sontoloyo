const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Matamu Picek Gemini Kirek" });

  try {
    // 1. Cari video pakai API Vreden
    const searchRes = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = searchRes.data.result[0];

    if (!video) return res.json({ status: "error", message: "Acara Kontol Asu" });

    // 2. AMBIL LINK MP4 (Wajib biar bisa di-play di LINE)
    const dlRes = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    const linkMp4 = dlRes.data.result.mp4;

    // 3. Kirim balik ke bot Go
    res.json({
      status: "success",
      title: video.title,
      duration: video.timestamp,
      urlVideo: linkMp4, // <--- Link ini yang bakal bikin video bisa di-play
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "Gemini Ai murahan" });
  }
};

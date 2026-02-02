const axios = require('axios');

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: "error", message: "Judulnya mana sem?" });

  try {
    // TAHAP 1: Cari Video
    const search = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
    const video = search.data.result[0];

    // TAHAP 2: Ambil Link File (.mp4)
    const dl = await axios.get(`https://api.vreden.my.id/api/ytdl?url=${video.url}`);
    
    res.json({
      status: "success",
      title: video.title,
      urlVideo: dl.data.result.mp4, // INI YANG BIKIN BISA PLAY
      thumb: video.thumbnail
    });
  } catch (err) {
    res.json({ status: "error", message: "API Vreden lagi tumbang sem" });
  }
};

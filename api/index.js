const axios = require("axios");

module.exports = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.json({
      status: "error",
      message: "Masukkan judul lagu!"
    });
  }

  try {
    const search = await axios.get(
      `https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(query)}`
    );

    if (!search.data.result?.length) {
      return res.json({
        status: "error",
        message: "Video tidak ditemukan"
      });
    }

    const video = search.data.result[0];

    const download = await axios.get(
      `https://api.vreden.my.id/api/ytdl?url=${video.url}`
    );

    res.json({
      status: "success",
      result: {
        title: video.title,
        author: video.author?.name || "Unknown",
        duration: video.duration || "-",
        thumbnail: video.thumbnail,
        youtube: video.url,
        video: download.data.result?.mp4 || null
      }
    });

  } catch (err) {
    console.error(err);

    res.json({
      status: "error",
      message: "Server error"
    });
  }
};

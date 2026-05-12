const { exec } = require("child_process");
const path = require("path");

// 📁 CHANGE THIS if your React app is elsewhere
const outputDir = path.join(__dirname, "../public/videos");

// 🎬 12 VIDEOS (safe stable trailers)
const videos = [
  // ANIME (3)
  { name: "anime1.mp4", url: "https://www.youtube.com/watch?v=6ZfuNTqbHE8" },
  { name: "anime2.mp4", url: "https://www.youtube.com/watch?v=5PSNL1qE6VY" },
  { name: "anime3.mp4", url: "https://www.youtube.com/watch?v=mqqft2x_Aa4" },

  // MOVIES (3)
  { name: "movie1.mp4", url: "https://www.youtube.com/watch?v=TcMBFSGVi1c" },
  { name: "movie2.mp4", url: "https://www.youtube.com/watch?v=EXeTwQWrcwY" },
  { name: "movie3.mp4", url: "https://www.youtube.com/watch?v=8ugaeA-nMTc" },

  // SERIES (3)
  { name: "series1.mp4", url: "https://www.youtube.com/watch?v=b9EkMc79ZSU" },
  { name: "series2.mp4", url: "https://www.youtube.com/watch?v=eOrNdBpGMv8" },
  { name: "series3.mp4", url: "https://www.youtube.com/watch?v=KPLWWIOCOOQ" },

  // KDRAMA (3)
  { name: "kdrama1.mp4", url: "https://www.youtube.com/watch?v=xLnTWxpTQt4" },
  { name: "kdrama2.mp4", url: "https://www.youtube.com/watch?v=V3hJ3s0Z6a4" },
  { name: "kdrama3.mp4", url: "https://www.youtube.com/watch?v=0X7G9hY5hQk" },
];

function downloadVideo(video) {
  const command = `yt-dlp -f mp4 -o "${outputDir}/${video.name}" "${video.url}"`;

  console.log(`⬇️ Downloading: ${video.name}`);

  exec(command, (error) => {
    if (error) {
      console.log(`❌ Failed: ${video.name}`);
      console.log(error.message);
    } else {
      console.log(`✅ Done: ${video.name}`);
    }
  });
}

// 🚀 run all downloads
videos.forEach(downloadVideo);
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let previousFrame = null;

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => alert("Camera error"));

function frameDifference(curr, prev) {
  let diff = 0;
  for (let i = 0; i < curr.data.length; i += 4) {
    diff += Math.abs(curr.data[i]   - prev.data[i]);
    diff += Math.abs(curr.data[i+1] - prev.data[i+1]);
    diff += Math.abs(curr.data[i+2] - prev.data[i+2]);
  }
  return diff;
}

video.addEventListener("play", () => {
  setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let status = "NO MOTION";

    if (previousFrame) {
      const diff = frameDifference(currentFrame, previousFrame);

      if (diff > 5000000) {
        status = "MOTION DETECTED 🚨";
      }
    }

    previousFrame = currentFrame;

    ctx.fillStyle = "lime";
    ctx.font = "24px Arial";
    ctx.fillText(status, 20, 40);

  }, 100);
});

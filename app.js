const tg = window.Telegram.WebApp;
tg.expand();

const btn = document.getElementById("btn");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

btn.onclick = () => {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false
  })
  .then(stream => {
    video.srcObject = stream;
    video.play();

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      stream.getTracks().forEach(track => track.stop());

      send();
    };
  })
  .catch(err => {
    alert("Ошибка камеры: " + err.name);
    console.error(err);
  });
};

function send() {
  fetch("https://script.google.com/macros/s/AKfycbzjkG7-rBxyG1EZNdr2s92VStuJb-pCdz4UqzT34hVHQ8DR0kvaysOdNrL4XnDisOA8/exec", {
    method: "POST",
    body: JSON.stringify({
      first_name: tg.initDataUnsafe.user.first_name,
      last_name: tg.initDataUnsafe.user.last_name
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(r => r.text())
  .then(t => alert(t))
  .catch(() => alert("Ошибка"));
}
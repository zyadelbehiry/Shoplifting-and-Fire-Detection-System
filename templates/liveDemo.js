var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var websocket = new WebSocket("ws://" + window.location.host + "/ws");

websocket.onmessage = function (event) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(event.data, 10, 50);
  console.log("alooo");
};

if (navigator.mediaDevices.getUserMedia) {
  console.log("alooo");

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      video.addEventListener("play", function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        setInterval(function () {
          ////////////capture the frame from the video
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (video.paused || video.ended) return;
          var frame = canvas.toDataURL("image/jpeg", 0.5);

          websocket.send(frame);
        }, 50); // send frame every 50 ms
      });
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
}
websocket.onmessage = function (event) {
  var statusParagraph = document.querySelector(".status");
  statusParagraph.textContent = event.data;
  if (event.data === "Checking...") {
    statusParagraph.classList.remove("normal-activity");
    statusParagraph.classList.remove("shoplifting-activity");
    statusParagraph.classList.add("checking");
  } else if (event.data === "Activity: Normal") {
    statusParagraph.classList.remove("shoplifting-activity");
    statusParagraph.classList.remove("checking");
    statusParagraph.classList.add("normal-activity");
  } else if (event.data === "Activity: Shoplifting") {
    statusParagraph.classList.remove("normal-activity");
    statusParagraph.classList.remove("checking");
    statusParagraph.classList.add("shoplifting-activity");
  }
};
console.log("alooo");
const press = document.getElementById("show-warning-btn");
const popup = document.querySelector("show-warning");
press.addEventListener("click", () => {
  console.log("alooo");
  popup.click();
});

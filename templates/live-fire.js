document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.getElementById("webcamFeed");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const resultDisplay = document.getElementById("result");
  //   const ws = new WebSocket(`ws://${window.location.host}/ws/fire_detection`);

  function setupWebSocket() {
    let ws = new WebSocket(
      "ws://" + window.location.host + "/ws/fire_detection"
    );

    ws.onopen = function () {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = function (event) {
      resultDisplay.innerText = event.data;
    };

    ws.onclose = function (e) {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
      setTimeout(function () {
        setupWebSocket();
      }, 1000);
    };

    ws.onerror = function (err) {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      ws.close();
    };

    return ws;
  }

  let ws = setupWebSocket();

  ws.onmessage = function (event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(event.data, 10, 50);
  };

  ws.onmessage = function (event) {
    resultDisplay.innerText = event.data;
    var statusParagraph = document.querySelector(".status");
    if (event.data === "Analysing..." || event.data === "No Fire Detected") {
      statusParagraph.classList.remove("fire-activity");
      statusParagraph.classList.add("normal-activity");
    } else if (event.data === "Fire Detected 🔥") {
      statusParagraph.classList.remove("normal-activity");
      statusParagraph.classList.add("fire-activity");
    }
  };

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.addEventListener("play", function () {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        setInterval(() => {
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          if (videoElement.paused || videoElement.ended) return;
          var frame = canvas.toDataURL("image/jpeg", 0.5);
          ws.send(frame);
        }, 50); // Sending frames every 50 ms
      });
    })
    .catch((error) => {
      console.error("Error accessing the webcam:", error);
    });
});

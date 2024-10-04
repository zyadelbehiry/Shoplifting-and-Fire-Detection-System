async function uploadVideo() {
  const videoUpload = document.getElementById("videoUpload").files[0];
  const formData = new FormData();
  formData.append("file", videoUpload);

  const response = await fetch("http://127.0.0.1:8000/upload-video/", {
    method: "POST",
    body: formData,
  });

  document.getElementById("processedVideo").src = "/processed-video/";
}
// let btn = document.querySelector(".run-btn");
// btn.addEventListener("click", function () {
//   document.getElementById("processedVideo").src = "/shoplifting_output.mp4";
// });

/* Funeral Pictorial — upload portal
   Built on Uppy (MIT, https://github.com/transloadit/uppy) with resumable
   uploads via the tus protocol (https://tus.io).

   TO GO LIVE: set UPLOAD_ENDPOINT to your tus server, e.g. a tusd instance
   (https://github.com/tus/tusd) running at https://uploads.yourdomain.com/files/
   Until then the page runs in demo mode: files are listed but not sent. */

var UPLOAD_ENDPOINT = "";          // e.g. "https://uploads.funeralpictorial.com/files/"
var MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024;   // 4 GB per file

(function () {
  "use strict";
  if (typeof Uppy === "undefined") { return; }

  var details = document.getElementById("upload-details");
  var success = document.getElementById("upload-success");
  var notice  = document.getElementById("upload-notice");

  function meta() {
    var data = {};
    new FormData(details).forEach(function (v, k) { data[k] = v; });
    data.page = location.href;
    return data;
  }

  var uppy = new Uppy.Uppy({
    autoProceed: false,
    restrictions: {
      maxFileSize: MAX_FILE_SIZE,
      allowedFileTypes: ["image/*", "video/*", ".heic", ".heif", ".mov", ".mp4", ".m4v", ".avi", ".wmv", ".m4a", ".mp3", ".wav"]
    },
    onBeforeUpload: function (files) {
      if (!details.reportValidity()) { return false; }
      var m = meta();
      Object.keys(files).forEach(function (id) { uppy.setFileMeta(id, m); });
      return true;
    }
  })
  .use(Uppy.Dashboard, {
    target: "#uploader",
    inline: true,
    height: 420,
    width: "100%",
    showProgressDetails: true,
    proudlyDisplayPoweredByUppy: false,
    note: "Photos and videos up to 4 GB each. Add as many as you like.",
    locale: { strings: {
      dropPasteFiles: "Drop photos and videos here, or %{browseFiles}",
      browseFiles: "tap to choose from your device",
      uploadXFiles: { 0: "Send %{smart_count} file", 1: "Send %{smart_count} files" },
      uploadXNewFiles: { 0: "Send +%{smart_count} file", 1: "Send +%{smart_count} files" },
      complete: "All files received",
      uploadComplete: "Upload complete"
    } }
  });

  if (UPLOAD_ENDPOINT) {
    uppy.use(Uppy.Tus, {
      endpoint: UPLOAD_ENDPOINT,
      retryDelays: [0, 1000, 3000, 5000, 10000],
      chunkSize: 8 * 1024 * 1024
    });
    uppy.on("complete", function (result) {
      if (result.successful && result.successful.length) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  } else {
    /* Demo mode: no upload plugin, so "Send" just validates and shows the notice */
    notice.hidden = false;
    uppy.on("upload", function () {
      notice.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  var copy = document.getElementById("copy-link");
  if (copy && navigator.clipboard) {
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(location.href).then(function () {
        copy.textContent = "Link copied";
        setTimeout(function () { copy.textContent = "Copy page link"; }, 2000);
      });
    });
  }
})();

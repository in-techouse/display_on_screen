const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
const validVideoTypes = ["video/mp4", "video/m4v", "video/avi", "video/mov", "video/mpg", "video/mpeg"];

let slideCount = 2;
let slideBackendIndex = 2;

$(document).ready(function() {
    $("#accordion").sortable();
    $("#accordion").disableSelection();
    $("#addNewSlide").click(function() {
        console.log("Add New Slide Clicked");
        addNewSlide();
    });
});

function selectFileForSlide(index) {
    console.log("selectFileForSlide, for index: ", index);
    $('#imageSlide' + index).hide(100);
    $("#videoSlide" + index).hide(100);
    $(".sliderInfo" + index).hide(100);
    $(".imageSlide" + index).hide(100);
    $(".videoSlide" + index).hide(100);
    $(".fileNameSlide" + index).text("");
    $(".fileNameSlide" + index).hide(100);
    $("#resolution" + index).text("");
    $("#length" + index).text("");
    $("#length" + index).parent().hide(100);
    $('#selectFileForSlide' + index).trigger('click');
}

function fileChangeForSlide(event, index) {
    $('.collapse').removeClass('show');
    $("#collapse" + index).addClass("show");
    console.log("fileChangeForSlide, Index ", index);
    const file = $("#selectFileForSlide" + index)[0].files[0];
    console.log("fileChangeForSlide, File is:", file);
    if (file === null || file === undefined) {
        return;
    }
    const fileType = file.type;
    console.log("fileChangeForSlide, File Type is:", fileType);
    $(".fileNameSlide" + index).text(file.name);
    $("#fileName" + index).text(file.name);
    $("#fileSize" + index).text((file.size / 1048576).toFixed(2) + " MB");
    $(".fileNameSlide" + index).show(100);
    $(".sliderInfo" + index).show(100);
    if ($.inArray(fileType, validImageTypes) > -1) {
        console.log("The file is an Image");
        $(".videoSlide" + index).hide(100);
        $(".videoIcon" + index).hide(100);
        $(".imageSlide" + index).show(100);
        $(".imageIcon" + index).show(100);
        $("#imageVideoLabel" + index).text("IMAGE");
        $("#imageVideoLabel" + index).show(100);
        $("#length" + index).parent().hide(100);
        showImage(file, index);
    } else {
        console.log("The file is an Video");
        $(".imageSlide" + index).hide(100);
        $(".imageIcon" + index).hide(100);
        $(".videoSlide" + index).show(100);
        $(".videoIcon" + index).show(100);
        $("#imageVideoLabel" + index).text("VIDEO");
        $("#imageVideoLabel" + index).show(100);
        showVideo(file, index);
    }
}

function showImage(file, index) {
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imageSlide' + index).attr('src', e.target.result);
            $('#imageSlide' + index).show(100);
            setTimeout(() => {
                const el = document.getElementById('imageSlide' + index);
                console.log("Image Resolution is: ", el);
                console.log("Image Resolution, Width is: ", el.naturalWidth);
                console.log("Image Resolution, Height is: ", el.naturalHeight);
                $("#resolution" + index).text(el.naturalWidth + " X " + el.naturalHeight);
            }, 500);
        }
        reader.readAsDataURL(file);
    }
}

function showVideo(file, index) {
    const video = $('#videoSlide' + index);
    video.attr('src', URL.createObjectURL(file));
    video.show();
    setTimeout(() => {
        console.log("Video Resolution, Width is: ", video[0].videoWidth);
        console.log("Video Resolution, Height is: ", video[0].videoHeight);
        $("#resolution" + index).text(video[0].videoWidth + " X " + video[0].videoWidth);
        console.log("Video Resolution, Duration is: ", video[0].duration);
        $("#length" + index).text((video[0].duration / 60).toFixed(2) + " Minutes");
        $("#length" + index).parent().show(100);
    }, 500);
}

function addNewSlide() {
    const slide = `
        <div class="card">
          <div class="card-header">
              <div class="row">
                  <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                      <h5 class="mb-0 btn-link" data-toggle="collapse" data-target="#collapse${slideBackendIndex}" aria-expanded="true" aria-controls="collapse${slideBackendIndex}">
                          Slide # ${slideCount}
                          <p>
                              <i class="fa fa-file-image-o imageSlide imageSlide${slideBackendIndex}" aria-hidden="true"></i>
                              <i class="fa fa-file-video-o videoSlide videoSlide${slideBackendIndex}" aria-hidden="true"></i>
                              <span class="fileNameSlide fileNameSlide${slideBackendIndex}"></span>
                          </p>
                      </h5>
                  </div>
                  <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 rightBlock">
                      <span><i class="fa fa-clock-o" aria-hidden="true"></i>0 seconds</span>
                      <i class="fa fa-arrows floatRight" aria-hidden="true"></i>
                      <i class="fa fa-trash floatRight iconTrash" aria-hidden="true"></i>
                      <i class="fa fa-paperclip floatRight" aria-hidden="true" onclick="selectFileForSlide('${slideBackendIndex}')"></i>
                      <input type="file" accept="image/*, video/*" id="selectFileForSlide${slideBackendIndex}" onchange="fileChangeForSlide(this, '${slideBackendIndex}')" />
                  </div>
              </div>
          </div>
          <div id="collapse${slideBackendIndex}" class="collapse show" data-parent="#accordion">
              <div class="card-body">
                  <div class="row">
                      <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <img id="imageSlide${slideBackendIndex}" />
                          <video controls id="videoSlide${slideBackendIndex}">
                                  <source id="videoSourceSlide${slideBackendIndex}" />
                              </video>
                      </div>
                      <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div class="container sliderInfo${slideBackendIndex}">
                              <h6>
                                  <i class="fa fa-file-image-o imageIcon${slideBackendIndex}" aria-hidden="true"></i>
                                  <i class="fa fa-file-video-o videoIcon${slideBackendIndex}" aria-hidden="true"></i>
                                  <span class="imageVideoLabel" id="imageVideoLabel${slideBackendIndex}"></span>
                              </h6>
                              <h6>
                                  <b>NAME:</b>
                                  <span id="fileName${slideBackendIndex}"></span>
                              </h6>
                              <h6>
                                  <b>SIZE:</b>
                                  <span id="fileSize${slideBackendIndex}"></span>
                              </h6>
                              <h6>
                                  <b>RESOLUTION:</b>
                                  <span id="resolution${slideBackendIndex}"></span>
                              </h6>
                              <h6>
                                  <b>LENGTH:</b>
                                  <span id="length${slideBackendIndex}"></span>
                              </h6>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;
    slideCount++;
    slideBackendIndex++;
    $('.collapse').removeClass('show');
    $("#accordion").append(slide);
}
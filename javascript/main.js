const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
const validVideoTypes = ["video/mp4", "video/m4v", "video/avi", "video/mov", "video/mpg", "video/mpeg"];

let slideCount = 2;
let slideBackendIndex = 2;

$(document).ready(function() {
    toggleTrashIcon();
    $("#accordion").sortable({
        start: function(event, ui) {
            console.log("jQuery UI, Sortable Event Starts");
        },
        change: function(event, ui) {
            console.log("jQuery UI, Sortable Event Change");
        },
        update: function(event, ui) {
            updateSlidesIndex();
        }
    });
    $("#accordion").disableSelection();
    $("#addNewSlide").click(function() {
        console.log("Add New Slide Clicked");
        addNewSlide();
    });
});

function toggleTrashIcon(){
    // Check slide count to show or hide selete icon
    if ($(".slide").length === 1) {
        $(".slide")[0].querySelector('.iconTrash').classList.add('hide');
    }else if ($(".slide").find('.iconTrash.hide')[0]) {
        $(".slide").find('.iconTrash.hide')[0].classList.remove('hide');
    }
}

function updateSlidesIndex() {
    const slides = $(".btn-link");
    slideCount = 1;
    slides.each(function(i, obj) {
        obj.innerText = "Slide # " + slideCount;
        slideCount++;
    });
}

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
        $("#displayTime" + index).val(video[0].duration);
    }, 500);
}

function addNewSlide() {
    const slide = `
        <div class="card card${slideBackendIndex} slide">
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
                      <i class="fa fa-trash floatRight iconTrash" aria-hidden="true" onclick="deleteSlide('${slideBackendIndex}')"></i>
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
                              <div>
                                  <label>Display Time <small>in seconds</small></label>
                                  <input type="number" name="display_time" id="displayTime${slideBackendIndex}" class="" min="0"/>
                              </div>
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
    toggleTrashIcon();
}

function deleteSlide(index) {
    console.log("Delete File called for index:", index);
    $(".card" + index).remove();
    slideCount--;
    updateSlidesIndex();
    toggleTrashIcon();
}

function runSlider() {
    let file_elements = $(".slide").find('input[type=file]');
    let files = []
    file_elements.each(function(i, obj) {
        let element;
        if ($.inArray(obj.files[0].type, validImageTypes) > -1) {
            element = `<img class="mySlides" src="${window.URL.createObjectURL(obj.files[0])}" style="width: 100%"></img>`
        }else {
            element = `<video class="mySlides" controls src="${window.URL.createObjectURL(obj.files[0])}" style="width: 100%"></video>`
        }
        $('#slideshow').append(element);
    });

    $("#slideshow")[0].classList.remove('hide');
    $(".create-slide")[0].classList.add('hide');
    carousel();
}

let myIndex = 0;

function carousel(){
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}
    x[myIndex-1].style.display = "block";
    x[myIndex-1].style.minWidth = "100%";
    x[myIndex-1].style.minHeight = "100%";
    setTimeout(carousel, 5000); // Change image every 2 seconds
}
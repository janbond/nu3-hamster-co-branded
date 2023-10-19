"use strict";

$(function () {
  $('#navbarCollapse').on('show.bs.collapse', function (e) {
    $('.wrapper').addClass("active");
    $('.navTrigger').addClass("active");
    $('a.nav-link').addClass("tracking-in-expand");
  });
  $('#navbarCollapse').on('hide.bs.collapse', function (e) {
    $('.wrapper').removeClass("active");
    $('.navTrigger').removeClass("active");
  });
  $("a.goTop").on('click', function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 550, function () {});
    }
  });
  $('[data-fancybox]').fancybox({
    protect: true,
    smallBtn: true,
    loop: false,
    infobar: false,
    arrows: false,
    animationEffect: "zoom-in-out",
    transitionEffect: "tube",
    animationDuration: 366,
    video: {
      tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}">' + '<source src="{{src}}" type="{{format}}" />' + 'Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!' + "</video>",
      format: "",
      // custom video format
      autoStart: true
    },
    margin: 400
  });
  var swiper = new Swiper('.swiper-container', {
    autoplay: {
      delay: 3000
    },
    watchOverflow: true,
    loop: true,
    cubeEffect: {
      slideShadows: false
    },
    pagination: {
      el: '.swiper-pagination',
      // dynamicBullets: true,
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
});
//# sourceMappingURL=all.js.map

// RESPONSIVE

// Breakpoints
const breakpoints = {
  fullHd: 1920,
  xxl: 1600,
  xl: 1366,
  lg: 992,
  md: 768,
  sm: 576,
  xsm: 375,
};

// Media quires
const MQ = {
  wWidth: 0,
  isXL: false,
  isLG: false,
  isMD: false,
  isSM: false,
  isXSM: false,
  updateState: function () {
    this.wWidth = $(window).width();

    for (let key in breakpoints) {
      this['is' + key.toUpperCase()] = this.wWidth <= breakpoints[key];
    }
  },
};

MQ.updateState();

$(window).on('load', function () {
  //
});

$(window).on('resize', function () {
  MQ.updateState();
});

// COMMON FUNCTIONS

// Popup opener
$('.js-popup').on('click', function (event) {
  event.preventDefault();
  let popupID = $(this).attr('href');

  mfpPopup(popupID);
});

// Mobile menu toggle
$('.hamburger-btn').on('click', function () {
  $(this).toggleClass('is-active');
  $('.menu').toggleClass('is-opened');
  $('body').toggleClass('overflow-hidden');
});

$('.menu__close-btn-wrap').on('click', function () {
  $('.menu').removeClass('is-opened');
  $('.hamburger-btn').removeClass('is-active');
});

// Phone input mask
$('input[type="tel"]').inputmask({
  mask: '+7 (999) 999-99-99',
  showMaskOnHover: false,
});

// E-mail Ajax Send
$('form').on('submit', function (e) {
  e.preventDefault();

  let form = $(this);
  let formData = {};
  formData.data = {};

  // Serialize
  form.find('input, textarea').each(function () {
    let name = $(this).attr('name');
    let title = $(this).attr('data-name');
    let value = $(this).val();

    formData.data[name] = {
      title: title,
      value: value,
    };

    if (name === 'subject') {
      formData.subject = {
        value: value,
      };
      delete formData.data.subject;
    }
  });

  $.ajax({
    type: 'POST',
    url: 'mail/mail.php',
    dataType: 'json',
    data: formData,
  }).done(function (data) {
    if (data.status === 'success') {
      if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
        form.find('.form-result').addClass('form-result--success');
      } else {
        mfpPopup('#success');
      }

      setTimeout(function () {
        if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
          form.find('.form-result').removeClass('form-result--success');
        }
        $.magnificPopup.close();
        form.trigger('reset');
      }, 3000);
    } else {
      alert('Ajax result: ' + data.status);
    }
  });
  return false;
});

const mfpPopup = function (popupID, source) {
  // https://dimsemenov.com/plugins/magnific-popup/
  $.magnificPopup.open({
    items: { src: popupID },
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    closeMarkup: '<button type="button" class="mfp-close">&times;</button>',
    mainClass: 'mfp-fade-zoom',
    // callbacks: {
    // 	open: function() {
    // 		$('.source').val(source);
    // 	}
    // }
  });
};

const sliderSettings = {
  direction: 'vertical',
  mousewheel: true,
  slidesPerView: 9,
  spaceBetween: 37,
  loop: true,
  effect: 'coverflow',
  centeredSlides: true,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 18,
    modifier: 1,
    slideShadows: false,
  },
};

const keysWheel = new Swiper('.keys__wheel', sliderSettings);

$('.keys__subitem').on('click', function (e) {
  e.preventDefault();
  $('.keys__subitem').removeClass('active');
  $(this).addClass('active');
});

const dropdownKeysSublist = () => {
  const btn = $('.keys__btn');
  btn.on('click', function (e) {
    e.preventDefault();
    const currentElement = $(e.currentTarget);
    const id = currentElement.attr('data-target').replace('#', '');
    const parent = $(this).closest('.keys__wheel');
    const currentDropdown = $(`.keys__dropdown[data-id="${id}"]`);
    parent.addClass('hide');
    currentDropdown.addClass('keys__dropdown--active');
  });

  $('.keys__dropdown-btn').on('click', function () {
    $(this).closest('.keys__col').find('.keys__wheel').removeClass('hide');
    $(this).closest('.keys__col').find('.keys__dropdown').removeClass('keys__dropdown--active');
  });
};

const initTextSlider = () => {
  const textSlider = document.querySelectorAll('.text-slider');

  textSlider.forEach((item, i) => {
    new Swiper(item, {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 1,
      autoHeight: true,
      pagination: {
        el: '.swiper-pagination',
      },
    });
  });
};

const calcRem = () => {
  if ($(window).outerWidth() <= breakpoints.fullHd) {
    $('html').removeAttr('style');
    return;
  }

  let _deltaX = 0;
  let _deltaY = 0;

  if (window.innerHeight < window.innerWidth) {
    _deltaX = (window.innerWidth / 1920) * 100;
    _deltaY = (window.innerHeight / 980) * 100;
  } else {
    _deltaX = (window.innerWidth / 1920) * 100;
    _deltaY = (window.innerHeight / 980) * 100;
  }

  if (_deltaX <= _deltaY) {
    $('html').css('font-size', _deltaX + '%');
  } else {
    $('html').css('font-size', _deltaY + '%');
  }
};

const initRems = () => {
  if ($(window).outerWidth() > breakpoints.fullHd) {
    calcRem();
  }

  $(window).on('load resize', function () {
    calcRem();
  });
};

$(document).ready(function () {
  dropdownKeysSublist();
  initTextSlider();
  initRems();
});

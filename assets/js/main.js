/**
* Template Name: Personal - v2.1.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  function closeMobileNav() {
    if ($('body').hasClass('mobile-nav-active')) {
      $('body').removeClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').fadeOut();
    }
  }

  function getCompactBarHeight() {
    return window.matchMedia('(max-width: 768px)').matches ? 56 : 70;
  }

  /**
   * Build a fixed overlay nav once. Lives outside #header, so showing/hiding it
   * does NOT change document height (which is what caused earlier scroll feedback).
   */
  function buildCompactNav() {
    if (document.querySelector('.compact-nav')) {
      return;
    }
    var $src = $('#header .nav-menu ul');
    if (!$src.length) {
      return;
    }
    var $bar = $('<div class="compact-nav" role="navigation" aria-label="Section navigation"></div>');
    var $brand = $('<div class="compact-nav__brand"><a href="#header">Antra Mahadkar Patel</a></div>');
    var $ul = $('<ul></ul>').html($src.html());
    $bar.append($brand).append($ul);
    $('body').append($bar);
  }

  var NAV_SECTION_IDS = ['header', 'about', 'experience', 'education', 'portfolio', 'skills', 'links', 'contacts'];

  function updateActiveNavFromScroll() {
    var probe = window.pageYOffset + getCompactBarHeight() + 24;
    var activeId = 'header';
    for (var i = 0; i < NAV_SECTION_IDS.length; i++) {
      var sid = NAV_SECTION_IDS[i];
      var el = document.getElementById(sid);
      if (!el) {
        continue;
      }
      var top = el.getBoundingClientRect().top + window.pageYOffset;
      if (top <= probe) {
        activeId = sid;
      }
    }
    var href = '#' + activeId;
    $('.nav-menu li, .mobile-nav li, .compact-nav li').removeClass('active');
    $('.nav-menu a[href="' + href + '"], .mobile-nav a[href="' + href + '"], .compact-nav a[href="' + href + '"]')
      .closest('li').addClass('active');
  }

  function smoothScrollTo(targetY) {
    var prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, targetY), behavior: prefersReduce ? 'auto' : 'smooth' });
  }

  function scrollToSectionElement(el) {
    if (!el) {
      return;
    }
    if (el.id === 'header') {
      smoothScrollTo(0);
      return;
    }
    var top = el.getBoundingClientRect().top + window.pageYOffset - getCompactBarHeight();
    smoothScrollTo(top);
  }

  /* CSS-only show/hide of the compact bar — no layout shift, so no scroll feedback. */
  var scrollTicking = false;
  $(window).on('scroll', function() {
    if (scrollTicking) {
      return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(function() {
      scrollTicking = false;
      var y = window.pageYOffset || 0;
      var threshold = window.innerHeight * 0.6;
      var shown = document.body.classList.contains('nav-shown');
      if (!shown && y > threshold) {
        document.body.classList.add('nav-shown');
      } else if (shown && y < threshold - 80) {
        document.body.classList.remove('nav-shown');
      }
      updateActiveNavFromScroll();
    });
  });

  // Single-page scroll for any anchor link (hero nav, mobile nav, compact nav).
  $(document).on('click', '.nav-menu a, .mobile-nav a, .compact-nav a', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var $target = hash ? $(hash) : $();
      if ($target.length) {
        e.preventDefault();

        $('.nav-menu li, .mobile-nav li, .compact-nav li').removeClass('active');
        $('.nav-menu a[href="' + hash + '"], .mobile-nav a[href="' + hash + '"], .compact-nav a[href="' + hash + '"]')
          .closest('li').addClass('active');

        closeMobileNav();
        scrollToSectionElement($target.get(0));

        if (hash === '#header' && typeof window.loadHeaderBgVideoIfNeeded === 'function') {
          window.loadHeaderBgVideoIfNeeded();
        }

        if (history.replaceState) {
          history.replaceState(null, '', hash || '#');
        }

        return false;
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        closeMobileNav();
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  buildCompactNav();

  // Deep link: scroll to hash on load (after compact nav + mobile nav exist for active state)
  if (window.location.hash) {
    var initial = window.location.hash;
    var $initial = $(initial);
    if ($initial.length) {
      window.requestAnimationFrame(function() {
        scrollToSectionElement($initial.get(0));
        updateActiveNavFromScroll();
      });
    }
  } else {
    $(function() {
      updateActiveNavFromScroll();
    });
  }

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Porfolio isotope and filter (skip when grid is not present, e.g. WIP portfolio)
  $(window).on('load', function() {
    var $portfolioContainer = $('.portfolio-container');
    if (!$portfolioContainer.length) {
      return;
    }

    var portfolioIsotope = $portfolioContainer.isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

  });

  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function() {
    $('.venobox').venobox();
  });

})(jQuery);
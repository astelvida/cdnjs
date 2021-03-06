/**
 * Tabslet | tabs jQuery plugin
 *
 * @copyright Copyright 2015, Dimitris Krestos
 * @license   Apache License, Version 2.0 (http://www.opensource.org/licenses/apache2.0.php)
 * @link      http://vdw.staytuned.gr
 * @version   v1.5.0
 */

  /* Sample html structure

  <div class='tabs'>
    <ul class='horizontal'>
      <li><a href="#tab-1">Tab 1</a></li>
      <li><a href="#tab-2">Tab 2</a></li>
      <li><a href="#tab-3">Tab 3</a></li>
    </ul>
    <div id='tab-1'></div>
    <div id='tab-2'></div>
    <div id='tab-3'></div>
  </div>

  OR

  <div class='tabs'>
    <ul class='horizontal'>
      <li><a href="#tab-1">Tab 1</a></li>
      <li><a href="#tab-2">Tab 2</a></li>
      <li><a href="#tab-3">Tab 3</a></li>
    </ul>
  </div>
  <div id='tabs_container'>
    <div id='tab-1'></div>
    <div id='tab-2'></div>
    <div id='tab-3'></div>
  </div>

  */

;(function($, window, undefined) {
  "use strict";

  $.fn.tabslet = function(options) {

    var defaults = {
      mouseevent:   'click',
      attribute:    'href',
      animation:    false,
      autorotate:   false,
      pauseonhover: true,
      delay:        2000,
      active:       1,
      container:    false,
      controls:     {
        prev: '.prev',
        next: '.next'
      }
    };

    var options = $.extend(defaults, options);

    return this.each(function() {

      var $this      = $(this), _cache_li = [], _cache_div = [];
      var _container = options.container ? $(options.container) : $this;
      var _tabs      = _container.find('> div');

      // Caching
      _tabs.each(function() { _cache_div.push($(this).css('display')); });

      // Autorotate
      var elements = $this.find('> ul li'), i = options.active - 1; // ungly

      if ( !$this.data( 'tabslet-init' ) ) {

        $this.data( 'tabslet-init', true );

        // Ungly overwrite
        options.mouseevent   = $this.data('mouseevent') || options.mouseevent;
        options.attribute    = $this.data('attribute') || options.attribute;
        options.animation    = $this.data('animation') || options.animation;
        options.autorotate   = $this.data('autorotate') || options.autorotate;
        options.pauseonhover = $this.data('pauseonhover') || options.pauseonhover;
        options.delay        = $this.data('delay') || options.delay;
        options.active       = $this.data('active') || options.active;
        options.container    = $this.data('container') || options.container;

        _tabs.hide();
        if ( options.active ) {
          _tabs.eq(options.active - 1).show();
          $this.find('> ul li').eq(options.active - 1).addClass('active');
        }

        var fn = eval(

          function() {

            $(this).trigger('_before');

            $this.find('> ul li').removeClass('active');
            $(this).addClass('active');
            _tabs.hide();

            i = elements.index($(this));

            var currentTab = $(this).find('a').attr(options.attribute);

            if (options.animation) {

              _container.find(currentTab).animate( { opacity: 'show' }, 'slow', function() {
                $(this).trigger('_after');
              });

            } else {

              _container.find(currentTab).show();
              $(this).trigger('_after');

            }

            return false;

          }

        );

        var init = eval("$this.find('> ul li')." + options.mouseevent + "(fn)");

        init;

        var t;

        var forward = function() {

          i = ++i % elements.length; // wrap around

          options.mouseevent == 'hover' ? elements.eq(i).trigger('mouseover') : elements.eq(i).click();

          if (options.autorotate) {

            clearTimeout(t);

            t = setTimeout(forward, options.delay);

            $this.mouseover(function () {

              if (options.pauseonhover) clearTimeout(t);

            });

          }

        }

        if (options.autorotate) {

          t = setTimeout(forward, options.delay);

          $this.hover(function() {

            if (options.pauseonhover) clearTimeout(t);

          }, function() {

            t = setTimeout(forward, options.delay);

          });

          if (options.pauseonhover) $this.on( "mouseleave", function() { clearTimeout(t); t = setTimeout(forward, options.delay); });

        }

        var move = function(direction) {

          if (direction == 'forward') i = ++i % elements.length; // wrap around

          if (direction == 'backward') i = --i % elements.length; // wrap around

          elements.eq(i).click();

        }

        $this.find(options.controls.next).click(function() {
          move('forward');
        });

        $this.find(options.controls.prev).click(function() {
          move('backward');
        });

        $this.on ('destroy', function() {
          $(this)
            .removeData()
            .find('> ul li').each( function(i) {
              $(this).removeClass('active');
            });
          _tabs.each( function(i) {
              $(this).removeAttr('style').css( 'display', _cache_div[i] );
            });
        });

      }

    });

  };

  $(document).ready(function () { $('[data-toggle="tabslet"]').tabslet(); });

})(jQuery);
//About Page Dripping Header 
var Drip = ( function() {
  'use strict';

  var canvas,
    ctx,
    shapes = [ {}, {}, {}, {}, {}, {}, {}, {} ],
    i,
    width,
    height,
    ySpeed = 1,
    createShape = function() {
      var y,
        rad;

      shapes.forEach( function( shape, index ) {
        shape.points = [];
        shape.alpha = 1 - ( index / shapes.length );
        shape.hue = (index % 13 === 0 ? 14 : 17) + ~~(Math.random() * 8 - 5);
        shape.saturation = 100;
        shape.lightness = 50;
        for ( i = 0; i < 21; ++i ) {
          y = ( i % 2 === 0 ? Math.random() * 40 : Math.random() * ( height * .25 ) ) + ( index * ( height / ( shapes.length - 1 ) ) );
          rad = Math.random() * 80;
          shape.points.push( {
            x: i * 20,
            ox: i * 20,
            y: y,
            oy: y,
            ooy: y,
            rad: rad,
            orad: rad,
            angle: Math.PI * Math.random(),
            speed: ( ( Math.PI / 80 ) + ( ( Math.PI / 80 ) * Math.random() ) ) * 1
          } );
        }
      } );
      shapes.reverse();
    },
    draw = function() {
      ctx.clearRect( 0, 0, width, height );
      var toReorder;
      shapes.forEach( function( shape, index ) {
        drawDrip( shape.points, shape.color, shape.alpha, shape.hue, shape.saturation, shape.lightness );
        var allDown = true,
          maxY = 0;

        shape.points.forEach( function( point ) {
          point.angle += point.speed;
          point.y = point.oy + ( Math.sin( point.angle ) * point.rad );
          point.oy += ySpeed;
          maxY = Math.max( point.y, maxY );
          if ( point.y < height ) {
            allDown = false;
          }
        } );
        shape.alpha = 1 - ( Math.min( maxY, height ) / height );
        if ( allDown ) {
          shape.points.forEach( function( point ) {
            point.y -= maxY;
            point.oy -= maxY;
            toReorder = index;
          } );
        }
      } );
      if ( toReorder !== undefined ) {
        shapes.push( shapes.splice( toReorder, 1 )[ 0 ] );
      }

      requestAnimationFrame( draw );
    },
    drawDrip = function( points, color, alpha, h, s, l ) {
      ctx.fillStyle = 'hsl(' + h + ', ' + ( s * alpha ) + '%, ' + ( ( l * alpha ) + 7 ) + '%)';
      ctx.beginPath();
      ctx.moveTo( 0, 0 );
      ctx.lineTo( points[ 0 ].x, points[ 0 ].y );

      for ( i = 1; i < points.length - 2; i++ ) {
        var xc = ( points[ i ].x + points[ i + 1 ].x ) / 2;
        var yc = ( points[ i ].y + points[ i + 1 ].y ) / 2;

        ctx.quadraticCurveTo( points[ i ].x, points[ i ].y, xc, yc );
      }

      ctx.quadraticCurveTo( points[ i ].x, points[ i ].y, points[ i + 1 ].x, points[ i + 1 ].y );
      ctx.lineTo( width, 0 );
      ctx.lineTo( 0, 0 );
      ctx.fill();
    },

    resizeHandler = function() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.setAttribute( 'width', width );
      canvas.setAttribute( 'height', height );
      var xr = width / 400;
      var yr = height / 400;

      ySpeed = 1 * yr;
      shapes.forEach( function( shape, index ) {
        shape.points.forEach( function( point ) {
          point.x = point.ox * xr;
          point.oy = point.ooy * yr;
          point.rad = point.orad * yr;
        } );
      } );
    },

    Drip = {
      init: function( _canvas ) {
        canvas = _canvas;
        width = canvas.getAttribute( 'width' );
        height = canvas.getAttribute( 'height' );
        ctx = canvas.getContext( '2d' );
        createShape();
        window.addEventListener( 'resize', resizeHandler );
        resizeHandler();
        draw();
      }
    };

  return Drip;
}() );

Drip.init( document.getElementById( 'drip-back' ) );

// About Page Time Line

(function () {
  "use strict";

  // define variables
  var items = document.querySelectorAll("#about-timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);
}() );

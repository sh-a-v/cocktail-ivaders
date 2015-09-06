(function(window, modules){

  modules.define(
    'AppCanvas',
    [
      'tools',
      'consts',
      'Drawable',
      'LightPair',
      'Countdown',
      'Traffic'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable,
      LightPair,
      Countdown,
      Traffic
    ){

      var AppCanvas = tools.extend(Drawable),

          $class    = AppCanvas,
          $super    = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._init();
        },

        _draw : function() {
          this._context.beginPath();
          this._context.fillStyle = '#000000';
          this._context.rect(0, 0, this._canvas.width, this._canvas.height);
          this._context.fill();
        },

        _drawChild : function(child) {
          if (child instanceof LightPair) {
            this._drawLightPair(child);
          } else if (child instanceof Countdown) {
            this._drawCountdown(child);
          } else if (child instanceof Traffic) {
            this._drawTraffic(child);
          }
        },

        _drawLightPair : function(lightPair) {
          lightPair.draw();
          this._context.drawImage(lightPair.getCanvas(), 0, 0);
        },

        _drawCountdown : function(countdown) {
          countdown.draw();
          this._context.drawImage(countdown.getCanvas(), 0, 0);
        },

        _drawTraffic : function(traffic) {
          var trafficSize = traffic.size();

          traffic.draw();

          if (traffic.isVer()) {
            this._context.drawImage(traffic.getCanvas(), this._canvas.width / 2 - trafficSize.width / 2, 0);
          } else if (traffic.isHor()) {
            this._context.drawImage(traffic.getCanvas(), 0, this._canvas.height / 2 - trafficSize.height / 2);
          }
        },

        _init : function() {
          this._canvas.setAttribute('id', 'app-canvas');
          document.body.appendChild(this._canvas);
          this._updateSize();
        },

        _updateSize : function() {
          this.size({
            width  : window.innerWidth,
            height : window.innerHeight
          });
        }
      });

    provide(AppCanvas);
  });

}(this, modules));
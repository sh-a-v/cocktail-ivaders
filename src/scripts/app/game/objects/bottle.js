(function(window, modules){

  modules.define(
    'Bottle',
    [
      'tools',
      'consts',
      'Drawable'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable
    ){

      var Bottle = tools.extend(Drawable),

        $class = Bottle,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._color = consts.BOTTLE_COLOR_GREEN;
          this._image = null;

          if (config) {
            if (config.color) {
              this._color = config.color;
            }
          }

          this._loadImage();
        },

        _loadImage : function() {
          if (!_.isNull(this._image)) {
            return;
          }

          var image = new Image();
           image.onload = function() {
             this._image = image;
           }.bind(this);

          if (this._color === consts.BOTTLE_COLOR_GREEN) {
            image.src = '/resources/images/bottle/3.png';
          } else if (this._color === consts.BOTTLE_COLOR_ORANGE) {
            image.src = '/resources/images/bottle/2.png';
          } else if (this._color === consts.BOTTLE_COLOR_RED) {
            image.src = '/resources/images/bottle/1.png';
          }
        },

        _draw : function() {
          if (_.isNull(this._image)) {
            return;
          }

          this._context.drawImage(this._image, 0, 0, consts.PLAYER_WIDTH, consts.PLAYER_HEIGHT);
        },

        _updateSize : function() {
          this.size({
            width  : consts.PLAYER_WIDTH,
            height : consts.PLAYER_HEIGHT
          });
        }

      });

      provide(Bottle);
    });

}(this, this.modules));
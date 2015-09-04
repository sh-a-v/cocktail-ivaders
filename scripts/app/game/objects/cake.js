(function(window, modules){

  modules.define(
    'Cake',
    [
      'tools',
      'consts',
      'Sprite'
    ],
    function(
      provide,
      tools,
      consts,
      Sprite
    ) {

      var Drawable = tools.extend(Sprite),

        $class = Drawable,
        $super = $class.superclass;

      _.extend($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            //sprite: '/resources/images/sprites/cake100.png',
            sprite: '/resources/images/sprites/cake50.png',
            steps: 36,
            speed: 25,
            size: {
              width  : consts.CAKE_WIDTH,
              height : consts.CAKE_HEIGHT
            }
          });
        },

        _updateSize : function() {
          this.size({
            width  : consts.CAKE_WIDTH,
            height : consts.CAKE_HEIGHT
          })
        }

      });

      provide(Drawable);

    }
  )

}(this, this.modules));
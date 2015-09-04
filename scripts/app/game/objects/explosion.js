(function(window, modules){

  modules.define(
    'Explosion',
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
    ){

      var EnemyBase = tools.extend(Sprite),

        $class = EnemyBase,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            sprite: '/resources/images/sprites/explosion16.png',
            steps: 16,
            speed: 25,
            loop: false,
            size: {
              width  : consts.EXPLOSION_WIDTH,
              height : consts.EXPLOSION_HEIGHT
            }
          });
        }

      });

      provide(EnemyBase);
    });

}(this, this.modules));
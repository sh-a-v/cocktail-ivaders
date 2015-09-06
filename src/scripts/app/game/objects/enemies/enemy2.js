(function(window, modules){

  modules.define(
    'Enemy2',
    [
      'tools',
      'consts',
      'EnemyBase'
    ],
    function(
      provide,
      tools,
      consts,
      EnemyBase
    ){

      var Enemy1 = tools.extend(EnemyBase),

        $class = Enemy1,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            src: '/resources/images/cocktails/2.png'
          });
        }

      });

      provide(Enemy1);
    });

}(this, this.modules));
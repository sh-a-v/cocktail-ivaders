(function(window, modules){

  modules.define(
    'Enemy1',
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
            src: '/resources/images/cocktails/1.png'
          });
        }

      });

      provide(Enemy1);
    });

}(this, this.modules));
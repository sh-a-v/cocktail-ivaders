(function(window, modules){

  modules.define(
    'AllEnemies',
    [
      'consts',
      'Enemy1',
      'Enemy2',
      'Enemy3',
      'Enemy4',
      'Enemy5'
    ],
    function(
      provide,
      consts,
      Enemy1,
      Enemy2,
      Enemy3,
      Enemy4,
      Enemy5
    ){
      provide([
        {
          type   : consts.ENEMY_TYPE_1,
          constr : Enemy1
        },
        {
          type   : consts.ENEMY_TYPE_2,
          constr : Enemy2
        },
        {
          type   : consts.ENEMY_TYPE_3,
          constr : Enemy3
        },
        {
          type   : consts.ENEMY_TYPE_4,
          constr : Enemy4
        },
        {
          type   : consts.ENEMY_TYPE_5,
          constr : Enemy5
        }
      ]);
    });

}(this, this.modules));
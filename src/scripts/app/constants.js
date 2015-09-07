(function(window, modules){

  modules.define('consts', function(provide){
    provide({

      GAME_WIDTH           : 850 * 2,
      GAME_HEIGHT          : 650 * 2,

      PLAYER_WIDTH         : 30  * 2,
      PLAYER_HEIGHT        : 108 * 2,

      BULLETS_PER_SECOND   : 1,

      BOTTLE_COLOR_GREEN   : 'green',
      BOTTLE_COLOR_ORANGE  : 'orange',
      BOTTLE_COLOR_RED     : 'red',

      SPRITE_DIRECTION_HOR : 'hor',
      SPRITE_DIRECTION_VER : 'ver',

      //CAKE_WIDTH           : 50 * 2,
      //CAKE_HEIGHT          : 50 * 2,

      CAKE_WIDTH           : 25 * 2,
      CAKE_HEIGHT          : 25 * 2,

      ENEMY_TYPE_1         : '1',
      ENEMY_TYPE_2         : '2',
      ENEMY_TYPE_3         : '3',
      ENEMY_TYPE_4         : '4',
      ENEMY_TYPE_5         : '5',

      ENEMY_CELL_WIDTH     : 70 * 2,
      ENEMY_CELL_HEIGHT    : 60 * 2,

      ENEMIES_ROWS_COUNT   : 4,
      ENEMIES_COLS_COUNT   : 10,

      EXPLOSION_WIDTH      : 48 * 2,
      EXPLOSION_HEIGHT     : 48 * 2,

      PROTECTION_WIDTH     : 64 * 2,
      PROTECTION_HEIGHT    : 64 * 2

    });
  })

}(this, modules));

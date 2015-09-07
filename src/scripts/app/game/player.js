(function(window, modules){

  modules.define(
    'Player',
    [
      'tools',
      'consts',
      'Drawer',
      'Controls',
      'Drawable',
      'Bottle'
    ],
    function(
      provide,
      tools,
      consts,
      Drawer,
      Controls,
      Drawable,
      Bottle
    ){

      var Player = tools.extend(Drawable),

        $class = Player,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._bottle = null;
          this._speed  = 500;

          this.x = consts.GAME_WIDTH / 2 - consts.PLAYER_WIDTH / 2;
          this.y = window.innerHeight * 2 - consts.PLAYER_HEIGHT + 50;

          this._initObjects();
        },

        pos : function() {
          return {
            x: this.x,
            y: this.y
          };
        },

        _initObjects : function() {
          if (_.isNull(this._bottle)) {
            this._bottle = new Bottle({
              color: consts.BOTTLE_COLOR_GREEN
            });
          }
        },

        _draw : function() {
          var moveDelta = null;

          if (Controls.isLeftPressed()) {
            moveDelta = -1;
          }

          if (Controls.isRightPressed()) {
            moveDelta = 1
          }

          if (!_.isNull(moveDelta)) {
            this.x = this.x + moveDelta * this._speed * Drawer.getDelta();

            this.x = Math.max(0, Math.min(consts.GAME_WIDTH - consts.PLAYER_WIDTH, this.x));
          }

          this._bottle.draw();
          this._context.drawImage(this._bottle.getCanvas(), 0, 0, consts.PLAYER_WIDTH, consts.PLAYER_HEIGHT)
        },

        _updateSize : function() {
          this.size({
            width  : consts.PLAYER_WIDTH,
            height : consts.PLAYER_HEIGHT
          });
        }

      });

      provide(Player);
    });

}(this, this.modules));

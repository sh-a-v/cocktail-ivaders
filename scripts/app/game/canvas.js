(function(window, modules){

  modules.define(
    'GameCanvas',
    [
      'tools',
      'consts',
      'Drawable',
      'Player',
      'Bullets',
      'Enemies'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable,
      Player,
      Bullets,
      Enemies
    ){

      var GameCanvas = tools.extend(Drawable),

          $class = GameCanvas,
          $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);


        },

        draw : function() {
          $super.draw.apply(this, arguments);
          this._notify('frame-drawn');
        },

        _draw : function() {
          this.redraw();
        },

        _drawChild : function(inst) {
          if (inst instanceof Player) {
            this._drawPlayer(inst);
          } else if (inst instanceof Bullets) {
            this._drawBullets(inst);
          } else if (inst instanceof Enemies) {
            this._drawEnemies(inst);
          }
        },

        _drawPlayer : function(player) {
          player.draw();
          this._context.drawImage(player.getCanvas(), player.x, player.y, player.width, player.height)
        },

        _drawBullets : function(bullets) {
          bullets.draw();
          this._context.drawImage(bullets.getCanvas(), 0, 0, this.width, this.height);
        },

        _drawEnemies : function(enemies) {
          enemies.draw();
          this._context.drawImage(enemies.getCanvas(), 0, 0, this.width, this.height);
        }

      });

      provide(GameCanvas);
  });

}(this, this.modules));
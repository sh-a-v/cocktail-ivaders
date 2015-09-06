(function(window, modules){

  modules.define(
    'EnemyBase',
    [
      'tools',
      'consts',
      'Resource'
    ],
    function(
      provide,
      tools,
      consts,
      Resource
    ){

      var EnemyBase = tools.extend(Resource),

        $class = EnemyBase,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);
        },

        getBoundingBox : function() {
          if (!this._resource) {
            return;
          }

          var rh = this._resource.height,
              ch = this._canvas.height,
              rw = this._resource.width,
              cw = this._canvas.width;

          var ph = ch / rh;
          var pw = rw * ph;

          return {
            t: 0,
            l:  cw / 2 - pw / 2,
            w: pw,
            h: ch
          }
        },

        _draw : function() {
          this.redraw();

          var rh = this._resource.height,
              ch = this._canvas.height,
              rw = this._resource.width,
              cw = this._canvas.width;

          var ph = ch / rh;
          var pw = rw * ph;

          this._context.drawImage(this._resource, 0, 0, rw, rh, cw / 2 - pw / 2, 0, pw, ch);
        },

        _updateSize : function() {
          this.size({
            width  : consts.ENEMY_CELL_WIDTH,
            height : consts.ENEMY_CELL_HEIGHT
          });
        }

      });

      provide(EnemyBase);
    });

}(this, this.modules));
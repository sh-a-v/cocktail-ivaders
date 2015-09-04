(function(window, modules){

  modules.define(
    'Enemies',
    [
      'tools',
      'consts',
      'Drawable',
      'Drawer',
      'Cake',
      'AllEnemies',
      'Explosion'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable,
      Drawer,
      Cake,
      AllEnemies,
      Explosion
    ){

      var Enemies = tools.extend(Drawable),

        $class = Enemies,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._objects     = [];

          this._movingSpeed       = 50;
          this._movingDelta       = 1;
          this._currentMoveOffset = 0;

          this._totalWidth  = consts.ENEMY_CELL_WIDTH  * consts.ENEMIES_COLS_COUNT;
          this._totalHeight = consts.ENEMY_CELL_HEIGHT * consts.ENEMIES_ROWS_COUNT;

          this._offsetX     = this._canvas.width  / 2 - this._totalWidth  / 2 - this._movingSpeed / 2;
          this._offsetY     = 100;

          this._explosions  = [];

          this.createObjects();
          this._startDeltaChanging();
          this._bindEvents();
        },

        createObjects : function() {
          var types = AllEnemies;
          var i = 0, j = 0, tmp, tmp2, ii, o;

          this._objects.length = 0;
          this._objects        = [];

          tmp2 = [];

          for (i; i < consts.ENEMIES_ROWS_COUNT; ++i) {
            tmp = [];
            j   = 0;
            for (j; j < consts.ENEMIES_COLS_COUNT; j++) {
              ii = j % types.length;
              o  = new types[ii].constr();
              tmp.push({
                o: o,
                x: j * consts.ENEMY_CELL_WIDTH  + this._offsetX,
                y: i * consts.ENEMY_CELL_HEIGHT + this._offsetY,
                w: consts.ENEMY_CELL_WIDTH,
                h: consts.ENEMY_CELL_HEIGHT
              });
            }
            tmp2.push(tmp);
          }

          tmp2.forEach(function(row){
            this._objects = this._objects.concat(row);
          }.bind(this));

          tmp2 = null;
        },

        getObjects : function() {
          return this._objects.filter(function(o){return !_.isNull(o)});
        },

        destroyObject : function(index) {
          var obj = this._objects[index];
          this._makeExplosion(obj);
          this._objects.splice(index, 1);
        },

        _bindEvents : function() {
          Drawer.on('animation-frame', function(delta) {
            this._currentMoveOffset += this._movingSpeed * delta * this._movingDelta
          }.bind(this));
        },

        _startDeltaChanging : function() {
          var me = this;
          setTimeout(function changeDelta(){
            me._movingDelta *= -1;
            setTimeout(changeDelta, 1000)
          }.bind(this), 1000);
        },

        _makeExplosion : function(obj) {
          var x = obj.x + obj.w / 2,
              y = obj.y + obj.h / 2,
              e = new Explosion();

          e.on('animation-end', function(){
            var index;
            e.off();
            index = this._explosions.map(function(o, i){if (o.o === e) {return i}}).filter(function(i){return i !== undefined})[0];
            if (index !== undefined) {
              this._explosions.splice(index, 1);
            }
          }.bind(this));

          this._explosions.push({
            o: e,
            x: obj.x + obj.w / 2 - consts.EXPLOSION_WIDTH / 2,
            y: obj.y + obj.h / 2 - consts.EXPLOSION_HEIGHT / 2
          });
        },

        _draw : function() {
          this.redraw();
          this._drawObjects();
          this._drawExplosions();
          this._clear();
        },

        _drawObjects : function() {
          this._objects.forEach(function(obj){
            if (!_.isNull(obj)) {
              this._drawObject(obj);
            }
          }.bind(this));
        },

        _drawExplosions : function() {
          this._explosions.forEach(function(e){
            var o = e.o,
                s = o.size();

            o.draw();

            this._context.drawImage(o.getCanvas(), e.x, e.y, s.width, s.height);
          }.bind(this));
        },

        _drawObject : function(obj) {
          var o = obj.o,
              x = obj.x,
              y = obj.y;

          o.draw();
          this._context.drawImage(o.getCanvas(), x + this._currentMoveOffset, y, o.width, o.height);
        },

        _clear : function() {

        }

      });

      provide(Enemies);
    });

}(this, this.modules));
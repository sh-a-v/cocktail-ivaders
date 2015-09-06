(function(window, modules){

  modules.define(
    'Bullets',
    [
      'tools',
      'consts',
      'Drawable',
      'Drawer',
      'Cake'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable,
      Drawer,
      Cake
    ){

      var Bullets = tools.extend(Drawable),

        $class = Bullets,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._speed = 750;
          this._cakes = [];
        },

        emit : function(config) {
          var speed    = config && config.speed    ? config.speed    : this._speed,
              x        = config && config.x        ? config.x        : 0,
              y        = config && config.y        ? config.y        : 0,
              cake     = new Cake();

          this._cakes.push({
            o : cake,
            s : speed,
            x : x,
            y : y,
            w : consts.CAKE_WIDTH,
            h : consts.CAKE_HEIGHT
          });
        },

        getObjects : function() {
          return this._cakes;
        },

        destroyObject : function(index) {
          this._cakes.splice(index, 1);
        },

        _draw : function() {
          this.redraw();

          this._cakes.forEach(function(c){
            var s = c.o.size();
            c.o.draw();
            this._context.drawImage(c.o.getCanvas(), c.x - s.width / 2, c.y - s.height / 2, s.width, s.height);

            c.y = c.y + Drawer.getDelta() * c.s * -1;
          }.bind(this));

          this._clear();

        },

        _clear : function() {
          var i = this._cakes.length - 1,
              cake;

          for (i; i > -1; --i) {
            cake = this._cakes[i];
            if (cake.y + cake.o.height < 0) {
              cake = null;
              this.destroyObject(i);
            }
          }
        }

      });

      provide(Bullets);
    });

}(this, this.modules));
(function(window, modules){

  var instance = null;

  modules.define(
    'DrawerConstructor',
    [
      'tools',
      'PubSub'
    ],
    function(
      provide,
      tools,
      PubSub
    ) {

      if (instance) {
        provide(instance);
        return;
      }

      var Drawer = tools.extend(PubSub),

          $class = Drawer,
          $super = $class.superclass;

      _.extend($class.prototype, {

        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._enabled  = false;
          this._delta    = null;
          this._timePrev = null;
          this._timeNow  = null;
        },

        start : function() {
          if (this._enabled) {
            return;
          }

          this._enabled = true;
          this._tick();
        },

        stop : function() {
          this._enabled = false;
        },

        getDelta : function() {
          return this._delta;
        },

        _tick : function() {
          if (this._timePrev === null) {
            this._timePrev = new Date().getTime();
            return this._tick();
          }

          if (!this._enabled) {
            return;
          }

          window.requestAnimationFrame(function() {
            this._timeNow  = (new Date).getTime();
            this._delta    = (this._timeNow - this._timePrev) / 1000;
            this._timePrev = this._timeNow;

            this._notify('animation-frame', this._delta);

            window.requestAnimationFrame(function() {
              this._tick();
            }.bind(this));
          }.bind(this));
        }

      });

      provide(Drawer);

    }
  );

  var instance;
  modules.define(
    'Drawer',
    [
      'DrawerConstructor'
    ],
    function(
      provide,
      DrawerConstructor
    ) {

      if (!instance) {
        instance = new DrawerConstructor();
      }

      provide(instance);
    }
  );

}(this, this.modules));
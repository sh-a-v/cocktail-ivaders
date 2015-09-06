(function(window, modules){

  modules.define(
    'Debouncer',
    [
      'tools',
      'PubSub'
    ],
    function(
      provide,
      tools,
      PubSub
    ) {

      var Debouncer = tools.extend(PubSub),

          $class   = Debouncer,
          $super   = $class.superclass;

      _.extend($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._callback       = null;
          this._timeout        = null;

          this._enabled         = false;
          this._timeoutHandler = null;

          if (config) {
            if (config.callback) {
              this._callback = config.callback;
            }
            if (config.timeout) {
              this._timeout = config.timeout;
            }
          }
        },

        start : function() {
          this._enabled = true;
          this._tick();
        },

        stop : function() {
          clearTimeout(this._timeoutHandler);
          this._enabled = false;
        },

        _tick : function() {
          if (!this._enabled) {
            return;
          }

          clearTimeout(this._timeoutHandler);
          this._timeoutHandler = setTimeout(function(){
            this._callback();
            this._tick();
          }.bind(this), this._timeout);
        }

      });

      provide(Debouncer);

    }
  );

}(this, this.modules));
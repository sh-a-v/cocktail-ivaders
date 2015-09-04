(function(window, modules){

  modules.define(
    'Canvas',
    [
      'tools',
      'PubSub'
    ],
    function(
      provide,
      tools,
      PubSub
    ){

      var Canvas = tools.extend(PubSub),

        $class = Canvas,
        $super = $class.superclass;

      _.mixin($class.prototype, {
        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._canvas  = null;
          this._context = null;

          this._width   = null;
          this._height  = null;

          this._initElement();
        },

        size : function(size) {
          if (_.isPlainObject(size)) {
            if (_.isNumber(size.height)) {
              this._height = size.height;
            }
            if (_.isNumber(size.width)) {
              this._width = size.width;
            }

            this._canvas.width  = this._width;
            this._canvas.height = this._height;

            this.redraw();
          } else {
            return {
              width: this._width,
              height: this._height
            };
          }
        },

        redraw : function() {
          this._canvas.width = this._canvas.width;
        },

        getCanvas : function() {
          return this._canvas;
        },

        getContext : function() {
          return this._context;
        },

        _initElement : function() {
          if (!_.isNull(this._canvas)) {
            return;
          }

          this._canvas  = document.createElement('canvas');
          this._context = this._canvas.getContext('2d');
        }
      });

      provide(Canvas);
    });

}(this, modules));
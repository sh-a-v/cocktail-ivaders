(function(window, modules){

  modules.define(
    'Drawable',
    [
      'tools',
      'consts',
      'Canvas',
      'Dispatcher'
    ],
    function(
      provide,
      tools,
      consts,
      Canvas,
      Dispatcher
    ) {

      var Drawable = tools.extend(Canvas),

          $class = Drawable,
          $super = $class.superclass;

      _.extend($class.prototype, {

        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._childDrawables = [];
          this._idle           = false;

          this._defineProperties();
          this._listenToDispatcher();
          this._updateSize();
        },

        _defineProperties : function() {
          var x = 0,
              y = 0;

          Object.defineProperty(this, 'x', {
            get : function() {
              return x;
            },
            set : function(val) {
              if (_.isNumber(val)) {
                x = val;
              }
            }
          });

          Object.defineProperty(this, 'y', {
            get : function() {
              return y;
            },
            set : function(val) {
              if (_.isNumber(val)) {
                y = val;
              }
            }
          });

          Object.defineProperty(this, 'width', {
            get : function() {
              return this.size().width;
            }.bind(this)
          });

          Object.defineProperty(this, 'height', {
            get : function() {
              return this.size().height;
            }.bind(this)
          });
        },

        idle : function(bool) {
          this._idle = !!bool;
        },

        draw : function() {
          if (!this._idle) {
            this._draw();
            this._drawChildren();
          } else {
            this.redraw();
          }
        },

        _draw : function() {

        },

        addChild : function(drawableInstance) {
          if (drawableInstance && drawableInstance instanceof Drawable) {
            this._childDrawables.push(drawableInstance);
          }
        },

        _drawChildren : function() {
          this._childDrawables.forEach(function(child){
            this._drawChild(child);
          }.bind(this));
        },

        _drawChild : function(inst) {

        },

        _listenToDispatcher : function() {
          Dispatcher.on('window-resize', function(){
            this._onWindowResize();
          }.bind(this));
        },

        _onWindowResize : function() {
          this._updateSize();
        },

        _updateSize : function() {
          this.size({
            width  : consts.GAME_WIDTH,
            height : consts.GAME_HEIGHT
          });
        }

      });

      provide(Drawable);

    }
  )

}(this, this.modules));
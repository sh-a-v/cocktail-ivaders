(function (window, _, modules) {

  modules.define(
    'BaseClass',
    [],
    function (provide) {

      function BaseClass() {
        this.initialize.apply(this, arguments);
      }

      _.mixin(BaseClass.prototype, {
        initialize : function () {
          //stub
        },
        destroy : function () {
          //stub
        }
      });

      provide(BaseClass);
    }
  );

}(this, this._, this.modules));
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
(function(window, modules){

  modules.define(
    'PubSub',
    [
      'tools',
      'BaseClass'
    ],
    function(
      provide,
      tools,
      BaseClass
    ){

    var PubSub = tools.extend(BaseClass),

        $class = PubSub,
        $super = $class.superclass;

    _.mixin($class.prototype, {

      initialize : function() {
        this._events   = [];

        $super.initialize.apply(this, arguments);
      },

      _notify : function(event) {
        if (!this._eventExists(event)) {
          return;
        }
        var me      = this,
          args    = Array.prototype.slice.call(arguments, 1),
          events  = this._getEventObject(event),
          removed = false;

        events.forEach(function(event){
          if (args.length > 0) {
            event.callback.apply(event.context, args);
          } else {
            event.callback.call(event.context);
          }

          if (_.isNumber(event.times)) {
            event.times -= 1;
            if (event.times <= 0) {
              me.off(event.event, event.callback, event.context);
              removed = true;
            }
          }
        });
      },

      on : function(event, callback, context) {
        if (!!_.isUndefined(event) && !!_.isUndefined(callback)) {
          return;
        }

        if (_.isArray(event)) {
          event.forEach(function(eventName) {
            this._pushEvent(eventName, callback, context);
          }.bind(this));
        } else if (_.isString(event)) {
          if (event.indexOf(' ') !== -1) {
            event = event.split(' ');
            event.forEach(function(eventName) {
              this._pushEvent(eventName, callback, context);
            }.bind(this));
          } else {
            this._pushEvent(event, callback, context);
          }
        }
      },

      _pushEvent : function(event, callback, context) {
        this._events.push({
          event: event,
          callback: callback,
          context: context
        });
      },

      once : function(event, callback, context) {
        if (event === undefined || callback === undefined) {
          return;
        }

        this._events.push({
          event: event,
          callback: callback,
          context: context,
          times: 1
        });
      },

      off : function(event, callback, context) {
        if (arguments.length === 0) {
          this._events.length = 0;
          this._events = [];
          return;
        }

        if (_.isArray(event)) {
          event.forEach(function(e){
            this.off(e, callback, context);
          }.bind(this));
          return;
        } else if (_.isString(event) && event.indexOf(' ') !== -1) {
          return this.off(event.split(' '), callback, context);
          return;
        }

        if (!this._eventExists(event)) {
          return;
        }

        var i, l = this._events.length,
          eventObject;
        for (i = 0; i < l; ++i) {
          eventObject = this._events[i];

          if (!_.isUndefined(callback) && !_.isUndefined(context)) {
            if (eventObject.event === event && eventObject.callback === callback && eventObject.context === context) {
              this._events.splice(i, 1);
              return;
            }
          } else if (!_.isUndefined(callback) && _.isUndefined(context)) {
            if (eventObject.event === event && eventObject.callback === callback) {
              this._events.splice(i, 1);
              return;
            }
          } else if (!_.isUndefined(event)) {
            if (eventObject.event === event) {
              this._events.splice(i, 1);
              return;
            }
          }
        }
      },

      destroy : function() {
        var me = this;

        if (_.isArray(this._events)) {
          this._events.length = 0;
          this._events = null;
        }

        $super.destroy.apply(this, arguments);
      },

      _getEventObject : function(event) {
        var i, l = this._events.length,
          events = [];
        for (i = 0; i < l; ++i) {
          if (this._events[i].event === event) {
            events.push(this._events[i]);
          }
        }
        return events;
      },

      _eventExists : function(event) {
        if (!this._events) { return false; }
        var i, l = this._events.length;
        for (i = 0; i < l; ++i) {
          if (this._events[i].event === event) {
            return true;
          }
        }
        return false;
      }

    });

    provide(PubSub);

  });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Resource',
    [
      'tools',
      'consts',
      'Drawable'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable
    ){

      var Resource = tools.extend(Drawable),

          $class = Resource,
          $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._src      = null;
          this._resource = null;
          this._width    = null;
          this._height   = null;

          this.setConfig(config);
          this.load();
        },

        setConfig : function(config) {
          if (config) {
            if (config.width) {
              this._width = config.width;
            }
            if (config.height) {
              this._height = config.height;
            }
            if (config.src) {
              this._src = config.src;
            }
          }
        },

        load : function() {
          this._resource = null;
          var image = new Image();
          image.onload = function() {
            this._resource = image;
            this._updateSize();
          }.bind(this);
          image.src = this._src;
        },

        draw : function() {
          if (_.isNull(this._resource)) {
            return;
          }
          $super.draw.apply(this, arguments);
        },

        _draw : function() {
          this.redraw();
          this._context.drawImage(this._resource, 0, 0, this._resource.width, this._resource.height);
        },

        _drawObjects : function() {

        },

        _clear : function() {

        },

        _updateSize : function() {
          if (this._width && this._height) {
            this.size({
              width  : this._width,
              height : this._height
            });
          } else if (this._resource) {
            this.size({
              width  : this._resource.width,
              height : this._resource.height
            });
          }
        }

      });

      provide(Resource);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Sprite',
    [
      'tools',
      'consts',
      'Drawable',
      'Drawer'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable,
      Drawer
    ) {

      var Sprite = tools.extend(Drawable),

        $class = Sprite,
        $super = $class.superclass;

      _.extend($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._sprite             = null;
          this._resource           = null;
          this._currentStep        = 0;
          this._steps              = 0;
          this._speed              = 100;
          this._direction          = consts.SPRITE_DIRECTION_VER;
          this._loop               = true;
          this._animating          = true;
          this._timeAfterPrevFrame = 0;
          this._isStopped          = false;

          if (config) {
            if (config.size) {
              this.size(config.size);
            }
            if (config.steps) {
              this._steps = config.steps;
            }
            if (config.speed) {
              this._speed = config.speed;
            }
            if (config.direction) {
              this._direction = config.direction;
            }
            if (config.loop !== undefined) {
              this._loop = config.loop;
            }
            if (config.sprite) {
              this._sprite = config.sprite;
            }
          }

          this._loadResource();
          this._bindEvents();
        },

        start : function() {
          this._animating = true;
        },

        stop : function() {
          this._animating = false;
        },

        _loadResource : function() {
          var image = new Image();
          image.onload = function() {
            this._resource = image;
          }.bind(this);
          image.src = this._sprite;
        },

        _bindEvents : function() {
          Drawer.on('animation-frame', function(timeDelta) {
            this._calculateNextFrame(timeDelta);
          }.bind(this));
        },

        _calculateNextFrame : function(timeDelta) {
          if (!this._sprite) {
            return;
          }

          if (!this._animating) {
            this._timeAfterPrevFrame = 0;
            return;
          }

          this._timeAfterPrevFrame += timeDelta * 1000;

          if (this._timeAfterPrevFrame < this._speed) {
            return;
          }

          var stepsToMove = Math.floor(this._timeAfterPrevFrame / this._speed);

          this._timeAfterPrevFrame = this._timeAfterPrevFrame % this._speed;

          var nextStepNumber = this._currentStep + stepsToMove;

          if (nextStepNumber > this._steps) {
            if (this._loop === false) {
              this._isStopped = true;
              this._notify('animation-end');
              return;
            }
            this._currentStep = nextStepNumber % this._steps;
          } else {
            this._currentStep = nextStepNumber;
          }
        },

        _draw : function() {
          this.redraw();

          if (!this._sprite) {
            return;
          }

          if (!this._resource) {
            return;
          }

          if (this._isStopped) {
            return;
          }

          var size = this.size();
          if (window.a === undefined) {
            window.a = 0;
          }
          if (this._direction === consts.SPRITE_DIRECTION_VER) {
            this._context.drawImage(this._resource, 0, 0, size.width, size.height * this._steps, 0, (this._currentStep - 1) * -size.height, size.width, size.height * this._steps);
            //this._context.drawImage(this._resource, 0, 0, size.width, size.height, 0, 70, 100, 100);
            //this._context.drawImage(this._resource, 0, 0, 100, 400, 0, window.a, 100, 400);
          } else {
            this._context.drawImage(this._resource, 0, 0, size.width, size.height, this._currentStep * size.width, 0, size.width, size.height);
          }
        },

        _updateSize : function() {
          this.size(this.size());
        }

      });

      provide(Sprite);

    }
  )

}(this, this.modules));
(function(window, modules){

  modules.define('tools', [], function(provide) {

    function extend(parent) {
      var f = function() {},
          c = function() {
            return this.initialize.apply(this, arguments);
          };

      f.prototype             = parent.prototype;
      c.prototype             = new f();
      c.prototype.constructor = c;
      c.superclass            = f.prototype;

      return c;
    }

    provide({
      extend: extend
    });

  });

}(this, modules));
(function(window, modules){

  modules.define(
    'View',
    [
      'tools',
      'PubSub'
    ],
    function(
      provide,
      tools,
      PubSub
    ){

        var View = tools.extend(PubSub),

            $class = View,
            $super = $class.superclass;

        _.mixin($class.prototype, {

          initialize : function(config) {
            $super.initialize.apply(this, arguments);

            var $element;
            Object.defineProperty(this, 'el', {
              get: function() {
                return $element && $element.length > 0 ? $element : null;
              },
              set: function(el) {
                if (!el) {
                  return;
                }
                if (window.$) {
                  if (el instanceof window.$) {
                    $element = el;
                  } else {
                    $element = window.$(el);
                  }
                }
              }
            });

            if (config) {
              if (config.el) {
                this.el = config.el
              }
            }
          }

        });

        provide(View);
  });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'AppCanvas',
    [
      'tools',
      'consts',
      'Drawable',
      'LightPair',
      'Countdown',
      'Traffic'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable,
      LightPair,
      Countdown,
      Traffic
    ){

      var AppCanvas = tools.extend(Drawable),

          $class    = AppCanvas,
          $super    = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._init();
        },

        _draw : function() {
          this._context.beginPath();
          this._context.fillStyle = '#000000';
          this._context.rect(0, 0, this._canvas.width, this._canvas.height);
          this._context.fill();
        },

        _drawChild : function(child) {
          if (child instanceof LightPair) {
            this._drawLightPair(child);
          } else if (child instanceof Countdown) {
            this._drawCountdown(child);
          } else if (child instanceof Traffic) {
            this._drawTraffic(child);
          }
        },

        _drawLightPair : function(lightPair) {
          lightPair.draw();
          this._context.drawImage(lightPair.getCanvas(), 0, 0);
        },

        _drawCountdown : function(countdown) {
          countdown.draw();
          this._context.drawImage(countdown.getCanvas(), 0, 0);
        },

        _drawTraffic : function(traffic) {
          var trafficSize = traffic.size();

          traffic.draw();

          if (traffic.isVer()) {
            this._context.drawImage(traffic.getCanvas(), this._canvas.width / 2 - trafficSize.width / 2, 0);
          } else if (traffic.isHor()) {
            this._context.drawImage(traffic.getCanvas(), 0, this._canvas.height / 2 - trafficSize.height / 2);
          }
        },

        _init : function() {
          this._canvas.setAttribute('id', 'app-canvas');
          document.body.appendChild(this._canvas);
          this._updateSize();
        },

        _updateSize : function() {
          this.size({
            width  : window.innerWidth,
            height : window.innerHeight
          });
        }
      });

    provide(AppCanvas);
  });

}(this, modules));
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
      EXPLOSION_HEIGHT     : 48 * 2

    });
  })

}(this, modules));
(function(window, modules){

  modules.define(
    'ControlsClass',
    [
      'tools',
      'PubSub'
    ],
    function(
      provide,
      tools,
      PubSub
    ){

      var Controls = tools.extend(PubSub),

          $class   = Controls,
          $super   = $class.superclass,

          $window  = $(window);

      _.mixin($class.prototype, {
        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._leftPressed  = false;
          this._rightPressed = false;

          this._bindEvents();
        },

        isLeftPressed : function() {
          return this._leftPressed;
        },

        isRightPressed : function() {
          return this._rightPressed;
        },

        _bindEvents : function() {
          $window.on('keydown', function(event) {
            this._onKeyDown(event);
          }.bind(this));
          $window.on('keyup', function(event) {
            this._onKeyUp(event);
          }.bind(this));
        },

        _onKeyDown : function(event) {
          if (this._isKeyCodeLeft(event.keyCode)) {
            this._leftPressed = true;
          }
          if (this._isKeyCodeRight(event.keyCode)) {
            this._rightPressed = true;
          }
          if (this._isKeyCodeWhitespace(event.keyCode)) {
            this._notify('whitespace-pressed');
          }
        },

        _onKeyUp : function(event) {
          if (this._isKeyCodeLeft(event.keyCode)) {
            this._leftPressed = false;
          }
          if (this._isKeyCodeRight(event.keyCode)) {
            this._rightPressed = false;
          }
        },

        _isKeyCodeLeft : function(val) {
          return val === 37;
        },

        _isKeyCodeRight : function(val) {
          return val === 39;
        },

        _isKeyCodeWhitespace : function(val) {
          return val === 32;
        }

      });

      provide(Controls);
    }
  );

  var instance = null;
  modules.define(
    'Controls',
    [
      'ControlsClass'
    ],
    function(
      provide,
      ControlsClass
    ){

      if (_.isNull(instance)) {
        instance = new ControlsClass();
      }

      provide(instance);
    }
  )

}(this, this.modules));
(function(window, modules){

  var instance;

  modules.define(
    'Dispatcher',
    [
      'tools',
      'PubSub'
    ], function(
      provide,
      tools,
      PubSub
    ) {

      if (!instance) {
        instance = new (tools.extend(PubSub))
      }

      provide(instance);
    });

}(this, this.modules));
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
(function(window, modules){

  modules.define(
    'windowResize',
    [
      'Dispatcher'
    ],
    function(
      provide,
      Dispatcher
    ){

      var windowResizeTimeout;

      window.addEventListener('resize', function(){
        clearTimeout(windowResizeTimeout);
        windowResizeTimeout = setTimeout(function(){
          Dispatcher._notify('window-resize');
        }, 300);
      });


      var controlLeft  = false,
          controlRight = false;
      window.addEventListener('keydown', function(event) {
        if (event.keyCode === 37) {

        }
      });

      provide();

  });

}(this, modules));
(function(window, modules){

  document.addEventListener('DOMContentLoaded', function(){
    modules.require(['appInit'], function(appInit){
      appInit();
    });
  });

}(this, this.modules));
(function(window, modules) {

  modules.define(
    'appInit',
    [
      'Dispatcher',
      'windowResize',
      'Scene',
      'Drawer'
    ],
    function(
      provide,
      Dispatcher,
      windowResize,
      Scene,
      Drawer
    ) {
      provide(function(){

        var scene = new Scene();
        scene.start();

        /*Drawer.on('animation-frame', function(delta) {
          scene.draw();
        });
        Drawer.start();

        //scene.start();

        document.body.addEventListener('click', function(event) {
          scene.toggle();
        });
        scene.start();*/



      });
    }
  );

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Scene',
    [
      'tools',
      'consts',
      'PubSub',
      'ScreenIntro',
      'ScreenGame'
    ],
    function(
      provide,
      tools,
      consts,
      PubSub,
      ScreenIntro,
      ScreenGame
    ){

      var Scene = tools.extend(PubSub),

        $class = Scene,
        $super = $class.superclass;

      _.extend($class.prototype, {

        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._screenIntro = null;
          this._screenGame  = null;

          this._initScreens();

          window.scene = this;
        },

        _initScreens : function() {
          if (_.isNull(this._screenIntro)) {
            this._screenIntro = new ScreenIntro();
          }
          if (_.isNull(this._screenGame)) {
            this._screenGame = new ScreenGame();
          }
        },

        start : function() {
          /*this._screenGame.fadeIn();
          this._screenGame.start();

          return;*/
          if (this._screenIntro) {
            this._screenIntro.on('end', function() {
              this._screenIntro.fadeOut(function(){
                this._screenGame.fadeIn();
                this._screenGame.start();
              }.bind(this));
            }.bind(this));

            this._screenIntro.fadeIn(function(){
              this._screenIntro.start();
            }.bind(this));
          }
        }

      });

      provide(Scene);

    });

}(this, this.modules));

(function(window, modules){

  modules.define(
    'StateLoop',
    [
      'tools',
      'consts',
      'PubSub'
    ],
    function(
      provide,
      tools,
      consts,
      PubSub
    ) {

      var StateLoop = tools.extend(PubSub),

          $class    = StateLoop,
          $super    = $class.superclass;

      _.extend(StateLoop.prototype, {

        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._timeoutHandler           = null;
          this._minTimeUnit              = 100;
          this._timePassedAfterLastState = 0;
          this._currentState             = null;
          this._states                   = [];
          this._enabled                  = false;
        },

        registerState : function(state) {
          if (Array.isArray(state)) {
            return state.forEach(function(action) {
              this.registerState(action)
            }.bind(this));
          }

          this._states.push(state);

          /*if (!this._currentState) {
            this._currentState = state;
          }*/
        },

        start : function() {
          if (this._enabled) {
            return;
          }

          this._enabled = true;

          if (!this._currentState) {
            this._currentState = this._states[0];
            this._currentState.callback();
          }

          this._tick();
        },

        stop : function() {
          clearTimeout(this._timeoutHandler);
          this._enabled = false;
        },

        clearStates : function() {
          this.stop();
          this._states.length = 0;
          this._states = [];
        },

        _tick : function() {
          if (!this._enabled) {
            return clearTimeout(this._timeoutHandler);
          }
          this._timeoutHandler = setTimeout(function(){
            this._timePassedAfterLastState += this._minTimeUnit;
            this._checkIfHasToMakeStateTransition();
          }.bind(this), this._minTimeUnit);

          this._notify('tick', {
            timeLeftBeforeNextState: this._currentState.duration - this._timePassedAfterLastState
          });
        },

        _checkIfHasToMakeStateTransition : function() {
          if (this._timePassedAfterLastState >= this._currentState.duration) {
            this._timePassedAfterLastState = 0;
            this._currentState = this._getNextState();
            this._currentState.callback();
          }

          this._tick();
        },

        _getNextState : function() {
          return this._states.filter(function(s){return s.state === this._currentState.to}.bind(this))[0];
        }

      });

      provide(StateLoop);

    }
  );

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Screen',
    [
      'tools',
      'View'
    ],
    function(
      provide,
      tools,
      View
    ){

      var Screen = tools.extend(View),

        $class = Screen,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._currentState = null;
          this._states       = [];

          this.el            = null;

          this._initElement();
          this._registerStates();
        },

        start : function() {
          this.nextState();
        },

        nextState : function() {
          var prevState = this._currentState,
              stateObj,
              timeoutHandler;
          if (this._currentState === null) {
            this._currentState = 0;
          } else {
            this._currentState = Math.max(0, Math.min(this._states.length - 1, this._currentState + 1));
          }

          if (this._currentState !== prevState) {
            stateObj = this._states[this._currentState];

            if (stateObj.name) {
              this.el.attr('data-state', stateObj.name);
              this.el.addClass('m-' + stateObj.name);
            }
            if (stateObj.before) {
              stateObj.before();
            }
            if (stateObj.after && stateObj.duration) {
              timeoutHandler = setTimeout(function(){
                stateObj.after();
                clearTimeout(timeoutHandler);
              }, stateObj.duration);
            }
          }
        },

        _registerStates : function() {

        },

        _registerState : function(obj) {
          if (_.isArray(obj)) {
            obj.forEach(function(state) {this._registerState(state)}.bind(this));
            return;
          }
          this._states.push(obj);
        },

        _initElement : function() {
          this.el = window.$('.scene[data-name="' + this._getPartName() + '"]')
        },

        _getPartName : function() {
          return '';
        },

        _notifyEnd : function() {
          this._notify('end');
        },

        fadeIn : function(callback) {
          this.el.removeClass('m-hidden');
          setTimeout(function(){
            if (callback) {
              callback();
            }
          }.bind(this), 500);
        },

        fadeOut : function(callback) {
          this.el.addClass('m-hidden');
          setTimeout(function(){
            if (callback) {
              callback();
            }
          }.bind(this), 500);
        }

      });

      provide(Screen);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'ScreenGame',
    [
      'tools',
      'Screen',
      'Game'
    ],
    function(
      provide,
      tools,
      Screen,
      Game
    ){

        var ScreenGame = tools.extend(Screen),

            $class = ScreenGame,
            $super = $class.superclass;

        _.mixin($class.prototype, {

          initialize : function(config) {
            $super.initialize.apply(this, arguments);

            this._game = null;

            this._initGame();
            this._bindEvents();
          },

          _initGame : function() {
            if (_.isNull(this._game)) {
              this._game = new Game({
                el: this.el.find('.game')
              });
            }
          },

          _bindEvents : function() {

          },

          _getPartName : function() {
            return 'game';
          },

          _registerStates : function() {
            this._registerState([
              {
                name: 'title-appears',
                after: function() {
                  this.nextState();
                }.bind(this),
                duration: 2000
                //duration: 100
              },
              {
                name: 'title-disappears',
                after: function() {

                }.bind(this),
                duration: 2000
              }
            ]);
          }

        });

        provide(ScreenGame);
  });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'ScreenIntro',
    [
      'tools',
      'Screen'
    ],
    function(
      provide,
      tools,
      Screen
    ){

        var ScreenIntro = tools.extend(Screen),

            $class = ScreenIntro,
            $super = $class.superclass;

        _.mixin($class.prototype, {

          initialize : function(config) {
            $super.initialize.apply(this, arguments);

            this.$karina           = this.el.find('.karina');
            this.$karinaDialogBox  = this.$karina.find('.karina-dialog');
            this.$karinaDialogText = this.$karina.find('.karina-dialog-text');

            this.$yes              = this.el.find('.control');

            this._typedInited      = false;

            this._bindEvents();
          },

          _bindEvents : function() {
            this.$yes.on('click', function(){
              this.nextState();
              this.$yes.off('click');
            }.bind(this));
          },

          _registerStates : function() {
            this._registerState([
              {
                name: 'karina-appears',
                after: function() {
                  this.nextState();
                }.bind(this),
                duration: 1000
              },
              {
                name: 'karina-speaks',
                before: function() {
                  this._speakIntro();
                }.bind(this),
                after: function() {
                  this.nextState();
                }.bind(this),
                duration: 4700
              },
              {
                name: 'controls-shown'
              },
              {
                name: 'yes-pressed',
                before: function() {
                  this._speakNiceChoice();
                }.bind(this),
                after: function() {
                  this.nextState();
                }.bind(this),
                duration: 4000
              },
              {
                name: 'karina-disappears',
                after: function() {
                  this.nextState();
                }.bind(this),
                duration: 2000
              },
              {
                name: 'end',
                before: function() {
                  this._notifyEnd();
                }.bind(this)
              }
            ]);
          },

          _recreateTextContainer : function() {
            var className = this.$karinaDialogText.attr('class');
            this.$karinaDialogText.remove();
            this.$karinaDialogText = $('<div>');
            this.$karinaDialogText.addClass(className);
            this.$karinaDialogText.appendTo(this.$karinaDialogBox);
          },

          _speakNiceChoice : function() {
            return this._speak('As I thought^300, time-waster. ^800Good luck!');
          },

          _speakIntro : function() {
            return this._speak('hey m^25a^25a^25a^25a^25a^25a^25a^25a^25a^25a^25a^25a^25a^25an, ^300have you ever striked down cocktails by cidor caps? ^500Wanna try?');
          },

          _speak : function(text) {
            this._recreateTextContainer();
            this.$karinaDialogText.typed({
              strings: [text],
              loop: false,
              showCursor: false
            });
          },

          _getPartName : function() {
            return 'intro';
          }

        });

        provide(ScreenIntro);
  });

}(this, this.modules));
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
(function(window, modules){

  modules.define(
    'Game',
    [
      'tools',
      'consts',
      'View',
      'Drawer',
      'Controls',
      'GameCanvas',
      'Player',
      'Cake',
      'Bullets',
      'Enemies'
    ],
    function(
      provide,
      tools,
      consts,
      View,
      Drawer,
      Controls,
      GameCanvas,
      Player,
      Cake,
      Bullets,
      Enemies
    ){

      var Game = tools.extend(View),

        $class = Game,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._canvas        = null;
          this._player        = null;
          this._bullets       = null;
          this._enemies       = null;

          this._playerCanFire = true;

          this._initPlayer();
          this._initBullets();
          this._initEnemies();
          this._initCanvas();

          this._bindEvents();

          Drawer.start();
        },

        _bindEvents : function() {
          Drawer.on('animation-frame', function(delta) {
            this._canvas.draw();
          }.bind(this));
          Controls.on('whitespace-pressed', function() {
            this._fireFriendlyBullet();
          }.bind(this));

          this._canvas.on('frame-drawn', function() {
            this._onFrameDrawn();
          }.bind(this));
        },

        _fireFriendlyBullet : function() {
          if (!this._playerCanFire) {
            return;
          }

          this._playerCanFire = false;

          var pos  = this._player.pos(),
              size = this._player.size();

          this._bullets.emit({
            x: pos.x + size.width / 2,
            y: pos.y
          });

          setTimeout(function(){
            this._playerCanFire = true;
          }.bind(this), 1000 / consts.BULLETS_PER_SECOND);
        },

        _onFrameDrawn : function() {
          this._calculatePenetrations();
        },

        _calculatePenetrations : function() {
          this._calculateCakesWithEnemiesPenetrations();
        },

        _calculateCakesWithEnemiesPenetrations : function() {
          var bullets = this._bullets.getObjects(),
              enemies = this._enemies.getObjects({ plain: true });

          if (bullets.length === 0 || enemies.length === 0) {
            return;
          }

          /*var collidedBullets = [],
              collidedEnemies = [];*/
          var collidedBullet,
              collidedEnemy;

          bullets.forEach(function(bullet, i){
            enemies.forEach(function(enemy, j){
              var bb = enemy.o.getBoundingBox(),
                  r1 = { x: bullet.x, y: bullet.y, w: bullet.w, h: bullet.h },
                  r2 = { x: enemy.x + bb.l * 2,  y: enemy.y - bb.t,  w: bb.w,  h: bb.h };

              if (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.h + r1.y > r2.y) {

                collidedBullet = i;
                collidedEnemy = j;
                /*if (collidedBullets.indexOf(i) === -1) {
                  collidedBullets.push(i);
                }

                if (collidedEnemies.indexOf(j) === -1) {
                  collidedEnemies.push(j);
                }*/
              }
            })
          });

          if (collidedBullet !== undefined) {
            console.log(bullets[collidedBullet]);
            this._bullets.destroyObject(collidedBullet);
          }
          if (collidedEnemy !== undefined) {
            console.log(enemies[collidedEnemy].x, enemies[collidedEnemy].o.getBoundingBox());
            this._enemies.destroyObject(collidedEnemy);
          }

          /*collidedBullets = collidedBullets.sort(function(a, b){ return a < b });
          collidedEnemies = collidedEnemies.sort(function(a, b){ return a < b });

          collidedBullets.forEach(function(i){
            this._bullets.destroyObject(i);
          }.bind(this));

          collidedEnemies.forEach(function(i){
            this._enemies.destroyObject(i);
          }.bind(this));*/
        },

        _initPlayer : function() {
          if (!_.isNull(this._player)) {
            return;
          }

          this._player = new Player();
        },

        _initBullets : function() {
          if (!_.isNull(this._bullets)) {
            return;
          }

          this._bullets = new Bullets();
        },

        _initEnemies : function() {
          if (!_.isNull(this._enemies)) {
            return;
          }

          this._enemies = new Enemies();
        },

        _initCanvas : function() {
          if (!_.isNull(this._canvas)) {
            return;
          }

          this._canvas = new GameCanvas();

          this._canvas.addChild(this._player);
          this._canvas.addChild(this._bullets);
          this._canvas.addChild(this._enemies);

          this.el.append(this._canvas.getCanvas());
        }

      });

      provide(Game);
    });

}(this, this.modules));
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
          this.y = consts.GAME_HEIGHT - consts.PLAYER_HEIGHT + 30;

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
(function(window, modules){

  modules.define(
    'Bottle',
    [
      'tools',
      'consts',
      'Drawable'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable
    ){

      var Bottle = tools.extend(Drawable),

        $class = Bottle,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._color = consts.BOTTLE_COLOR_GREEN;
          this._image = null;

          if (config) {
            if (config.color) {
              this._color = config.color;
            }
          }

          this._loadImage();
        },

        _loadImage : function() {
          if (!_.isNull(this._image)) {
            return;
          }

          var image = new Image();
           image.onload = function() {
             this._image = image;
           }.bind(this);

          if (this._color === consts.BOTTLE_COLOR_GREEN) {
            image.src = '/resources/images/bottle/3.png';
          } else if (this._color === consts.BOTTLE_COLOR_ORANGE) {
            image.src = '/resources/images/bottle/2.png';
          } else if (this._color === consts.BOTTLE_COLOR_RED) {
            image.src = '/resources/images/bottle/1.png';
          }
        },

        _draw : function() {
          if (_.isNull(this._image)) {
            return;
          }

          this._context.drawImage(this._image, 0, 0, consts.PLAYER_WIDTH, consts.PLAYER_HEIGHT);
        },

        _updateSize : function() {
          this.size({
            width  : consts.PLAYER_WIDTH,
            height : consts.PLAYER_HEIGHT
          });
        }

      });

      provide(Bottle);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Cake',
    [
      'tools',
      'consts',
      'Sprite'
    ],
    function(
      provide,
      tools,
      consts,
      Sprite
    ) {

      var Drawable = tools.extend(Sprite),

        $class = Drawable,
        $super = $class.superclass;

      _.extend($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            //sprite: '/resources/images/sprites/cake100.png',
            sprite: '/resources/images/sprites/cake50.png',
            steps: 36,
            speed: 25,
            size: {
              width  : consts.CAKE_WIDTH,
              height : consts.CAKE_HEIGHT
            }
          });
        },

        _updateSize : function() {
          this.size({
            width  : consts.CAKE_WIDTH,
            height : consts.CAKE_HEIGHT
          })
        }

      });

      provide(Drawable);

    }
  )

}(this, this.modules));
(function(window, modules){

  modules.define(
    'AllEnemies',
    [
      'consts',
      'Enemy1',
      'Enemy2',
      'Enemy3',
      'Enemy4',
      'Enemy5'
    ],
    function(
      provide,
      consts,
      Enemy1,
      Enemy2,
      Enemy3,
      Enemy4,
      Enemy5
    ){
      provide([
        {
          type   : consts.ENEMY_TYPE_1,
          constr : Enemy1
        },
        {
          type   : consts.ENEMY_TYPE_2,
          constr : Enemy2
        },
        {
          type   : consts.ENEMY_TYPE_3,
          constr : Enemy3
        },
        {
          type   : consts.ENEMY_TYPE_4,
          constr : Enemy4
        },
        {
          type   : consts.ENEMY_TYPE_5,
          constr : Enemy5
        }
      ]);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Explosion',
    [
      'tools',
      'consts',
      'Sprite'
    ],
    function(
      provide,
      tools,
      consts,
      Sprite
    ){

      var EnemyBase = tools.extend(Sprite),

        $class = EnemyBase,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            sprite: '/resources/images/sprites/explosion16.png',
            steps: 16,
            speed: 25,
            loop: false,
            size: {
              width  : consts.EXPLOSION_WIDTH,
              height : consts.EXPLOSION_HEIGHT
            }
          });
        }

      });

      provide(EnemyBase);
    });

}(this, this.modules));
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
(function(window, modules){

  modules.define(
    'Enemy1',
    [
      'tools',
      'consts',
      'EnemyBase'
    ],
    function(
      provide,
      tools,
      consts,
      EnemyBase
    ){

      var Enemy1 = tools.extend(EnemyBase),

        $class = Enemy1,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            src: '/resources/images/cocktails/1.png'
          });
        }

      });

      provide(Enemy1);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Enemy2',
    [
      'tools',
      'consts',
      'EnemyBase'
    ],
    function(
      provide,
      tools,
      consts,
      EnemyBase
    ){

      var Enemy1 = tools.extend(EnemyBase),

        $class = Enemy1,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            src: '/resources/images/cocktails/2.png'
          });
        }

      });

      provide(Enemy1);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Enemy3',
    [
      'tools',
      'consts',
      'EnemyBase'
    ],
    function(
      provide,
      tools,
      consts,
      EnemyBase
    ){

      var Enemy1 = tools.extend(EnemyBase),

        $class = Enemy1,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            src: '/resources/images/cocktails/3.png'
          });
        }

      });

      provide(Enemy1);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Enemy4',
    [
      'tools',
      'consts',
      'EnemyBase'
    ],
    function(
      provide,
      tools,
      consts,
      EnemyBase
    ){

      var Enemy1 = tools.extend(EnemyBase),

        $class = Enemy1,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            src: '/resources/images/cocktails/4.png'
          });
        }

      });

      provide(Enemy1);
    });

}(this, this.modules));
(function(window, modules){

  modules.define(
    'Enemy5',
    [
      'tools',
      'consts',
      'EnemyBase'
    ],
    function(
      provide,
      tools,
      consts,
      EnemyBase
    ){

      var Enemy1 = tools.extend(EnemyBase),

        $class = Enemy1,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.call(this, {
            src: '/resources/images/cocktails/5.png'
          });
        }

      });

      provide(Enemy1);
    });

}(this, this.modules));
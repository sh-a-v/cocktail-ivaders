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
          this._delay              = 0;
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
            if (config.delay) {
              this._delay = config.delay;
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

              if (this._delay) {
                setTimeout(function() {
                  this._isStopped = true;
                  this._notify('animation-end');
                }.bind(this), this._delay);
              } else {
                this._isStopped = true;
                this._notify('animation-end');
              }

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

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
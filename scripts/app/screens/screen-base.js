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
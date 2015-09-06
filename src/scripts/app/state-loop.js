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
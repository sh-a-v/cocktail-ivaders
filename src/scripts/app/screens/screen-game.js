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
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

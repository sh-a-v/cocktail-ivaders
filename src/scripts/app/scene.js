(function(window, modules){

  modules.define(
    'Scene',
    [
      'tools',
      'consts',
      'PubSub',
      'ScreenIntro',
      'ScreenGame',
      'ScreenEnd'
    ],
    function(
      provide,
      tools,
      consts,
      PubSub,
      ScreenIntro,
      ScreenGame,
      ScreenEnd
    ){

      var Scene = tools.extend(PubSub),

        $class = Scene,
        $super = $class.superclass;

      _.extend($class.prototype, {

        initialize : function() {
          $super.initialize.apply(this, arguments);

          this._screenIntro = null;
          this._screenGame  = null;
          this._screenEnd  = null;

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
          if (_.isNull(this._screenEnd)) {
            this._screenEnd = new ScreenEnd();
          }
        },

        start : function() {
          this._screenGame.fadeIn();
          this._screenGame.start();
          return;

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

          this._screenGame.on('end', function() {
            this._screenGame.fadeOut(function(){
              this._screenEnd.fadeIn();
              this._screenEnd.start();
            }.bind(this));
          }.bind(this));
        }

      });

      provide(Scene);

    });

}(this, this.modules));

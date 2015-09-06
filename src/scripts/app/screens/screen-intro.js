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
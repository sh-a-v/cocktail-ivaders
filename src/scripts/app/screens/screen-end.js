(function(window, modules){

  modules.define(
    'ScreenEnd',
    [
      'tools',
      'Screen'
    ],
    function(
      provide,
      tools,
      Screen
    ){

      var ScreenEnd = tools.extend(Screen),

        $class = ScreenEnd,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._bindEvents();
        },

        _bindEvents : function() {

        },

        _getPartName : function() {
          return 'end';
        },

        _registerStates : function() {
          this._registerState([
            {
              name: 'end'
            }
          ]);
        }

      });

      provide(ScreenEnd);
    });

}(this, this.modules));

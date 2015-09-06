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
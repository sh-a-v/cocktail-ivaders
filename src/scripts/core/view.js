(function(window, modules){

  modules.define(
    'View',
    [
      'tools',
      'PubSub'
    ],
    function(
      provide,
      tools,
      PubSub
    ){

        var View = tools.extend(PubSub),

            $class = View,
            $super = $class.superclass;

        _.mixin($class.prototype, {

          initialize : function(config) {
            $super.initialize.apply(this, arguments);

            var $element;
            Object.defineProperty(this, 'el', {
              get: function() {
                return $element && $element.length > 0 ? $element : null;
              },
              set: function(el) {
                if (!el) {
                  return;
                }
                if (window.$) {
                  if (el instanceof window.$) {
                    $element = el;
                  } else {
                    $element = window.$(el);
                  }
                }
              }
            });

            if (config) {
              if (config.el) {
                this.el = config.el
              }
            }
          }

        });

        provide(View);
  });

}(this, this.modules));
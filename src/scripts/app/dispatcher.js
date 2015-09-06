(function(window, modules){

  var instance;

  modules.define(
    'Dispatcher',
    [
      'tools',
      'PubSub'
    ], function(
      provide,
      tools,
      PubSub
    ) {

      if (!instance) {
        instance = new (tools.extend(PubSub))
      }

      provide(instance);
    });

}(this, this.modules));
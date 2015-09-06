(function(window, modules){

  modules.define(
    'PubSub',
    [
      'tools',
      'BaseClass'
    ],
    function(
      provide,
      tools,
      BaseClass
    ){

    var PubSub = tools.extend(BaseClass),

        $class = PubSub,
        $super = $class.superclass;

    _.mixin($class.prototype, {

      initialize : function() {
        this._events   = [];

        $super.initialize.apply(this, arguments);
      },

      _notify : function(event) {
        if (!this._eventExists(event)) {
          return;
        }
        var me      = this,
          args    = Array.prototype.slice.call(arguments, 1),
          events  = this._getEventObject(event),
          removed = false;

        events.forEach(function(event){
          if (args.length > 0) {
            event.callback.apply(event.context, args);
          } else {
            event.callback.call(event.context);
          }

          if (_.isNumber(event.times)) {
            event.times -= 1;
            if (event.times <= 0) {
              me.off(event.event, event.callback, event.context);
              removed = true;
            }
          }
        });
      },

      on : function(event, callback, context) {
        if (!!_.isUndefined(event) && !!_.isUndefined(callback)) {
          return;
        }

        if (_.isArray(event)) {
          event.forEach(function(eventName) {
            this._pushEvent(eventName, callback, context);
          }.bind(this));
        } else if (_.isString(event)) {
          if (event.indexOf(' ') !== -1) {
            event = event.split(' ');
            event.forEach(function(eventName) {
              this._pushEvent(eventName, callback, context);
            }.bind(this));
          } else {
            this._pushEvent(event, callback, context);
          }
        }
      },

      _pushEvent : function(event, callback, context) {
        this._events.push({
          event: event,
          callback: callback,
          context: context
        });
      },

      once : function(event, callback, context) {
        if (event === undefined || callback === undefined) {
          return;
        }

        this._events.push({
          event: event,
          callback: callback,
          context: context,
          times: 1
        });
      },

      off : function(event, callback, context) {
        if (arguments.length === 0) {
          this._events.length = 0;
          this._events = [];
          return;
        }

        if (_.isArray(event)) {
          event.forEach(function(e){
            this.off(e, callback, context);
          }.bind(this));
          return;
        } else if (_.isString(event) && event.indexOf(' ') !== -1) {
          return this.off(event.split(' '), callback, context);
          return;
        }

        if (!this._eventExists(event)) {
          return;
        }

        var i, l = this._events.length,
          eventObject;
        for (i = 0; i < l; ++i) {
          eventObject = this._events[i];

          if (!_.isUndefined(callback) && !_.isUndefined(context)) {
            if (eventObject.event === event && eventObject.callback === callback && eventObject.context === context) {
              this._events.splice(i, 1);
              return;
            }
          } else if (!_.isUndefined(callback) && _.isUndefined(context)) {
            if (eventObject.event === event && eventObject.callback === callback) {
              this._events.splice(i, 1);
              return;
            }
          } else if (!_.isUndefined(event)) {
            if (eventObject.event === event) {
              this._events.splice(i, 1);
              return;
            }
          }
        }
      },

      destroy : function() {
        var me = this;

        if (_.isArray(this._events)) {
          this._events.length = 0;
          this._events = null;
        }

        $super.destroy.apply(this, arguments);
      },

      _getEventObject : function(event) {
        var i, l = this._events.length,
          events = [];
        for (i = 0; i < l; ++i) {
          if (this._events[i].event === event) {
            events.push(this._events[i]);
          }
        }
        return events;
      },

      _eventExists : function(event) {
        if (!this._events) { return false; }
        var i, l = this._events.length;
        for (i = 0; i < l; ++i) {
          if (this._events[i].event === event) {
            return true;
          }
        }
        return false;
      }

    });

    provide(PubSub);

  });

}(this, this.modules));
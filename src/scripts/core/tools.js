(function(window, modules){

  modules.define('tools', [], function(provide) {

    function extend(parent) {
      var f = function() {},
          c = function() {
            return this.initialize.apply(this, arguments);
          };

      f.prototype             = parent.prototype;
      c.prototype             = new f();
      c.prototype.constructor = c;
      c.superclass            = f.prototype;

      return c;
    }

    provide({
      extend: extend
    });

  });

}(this, modules));
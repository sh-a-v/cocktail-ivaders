(function(window, modules){

  modules.define(
    'Resource',
    [
      'tools',
      'consts',
      'Drawable'
    ],
    function(
      provide,
      tools,
      consts,
      Drawable
    ){

      var Resource = tools.extend(Drawable),

          $class = Resource,
          $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._src      = null;
          this._resource = null;
          this._width    = null;
          this._height   = null;

          this.setConfig(config);
          this.load();
        },

        setConfig : function(config) {
          if (config) {
            if (config.width) {
              this._width = config.width;
            }
            if (config.height) {
              this._height = config.height;
            }
            if (config.src) {
              this._src = config.src;
            }
          }
        },

        load : function() {
          this._resource = null;
          var image = new Image();
          image.onload = function() {
            this._resource = image;
            this._updateSize();
          }.bind(this);
          image.src = this._src;
        },

        draw : function() {
          if (_.isNull(this._resource)) {
            return;
          }
          $super.draw.apply(this, arguments);
        },

        _draw : function() {
          this.redraw();
          this._context.drawImage(this._resource, 0, 0, this._resource.width, this._resource.height);
        },

        _drawObjects : function() {

        },

        _clear : function() {

        },

        _updateSize : function() {
          if (this._width && this._height) {
            this.size({
              width  : this._width,
              height : this._height
            });
          } else if (this._resource) {
            this.size({
              width  : this._resource.width,
              height : this._resource.height
            });
          }
        }

      });

      provide(Resource);
    });

}(this, this.modules));
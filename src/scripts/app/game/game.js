(function(window, modules){

  modules.define(
    'Game',
    [
      'tools',
      'consts',
      'View',
      'Drawer',
      'Controls',
      'GameCanvas',
      'Player',
      'Cake',
      'Bullets',
      'Enemies'
    ],
    function(
      provide,
      tools,
      consts,
      View,
      Drawer,
      Controls,
      GameCanvas,
      Player,
      Cake,
      Bullets,
      Enemies
    ){

      var Game = tools.extend(View),

        $class = Game,
        $super = $class.superclass;

      _.mixin($class.prototype, {

        initialize : function(config) {
          $super.initialize.apply(this, arguments);

          this._canvas        = null;
          this._player        = null;
          this._bullets       = null;
          this._enemies       = null;

          this._playerCanFire = true;

          this._initPlayer();
          this._initBullets();
          this._initEnemies();
          this._initCanvas();

          this._bindEvents();

          Drawer.start();
        },

        _bindEvents : function() {
          Drawer.on('animation-frame', function(delta) {
            this._canvas.draw();
          }.bind(this));
          Controls.on('whitespace-pressed', function() {
            this._fireFriendlyBullet();
          }.bind(this));

          this._canvas.on('frame-drawn', function() {
            this._onFrameDrawn();
          }.bind(this));

          this._enemies.on('all-destroyed', function() {
            this._notify('game-over');
          }.bind(this));
        },

        _fireFriendlyBullet : function() {
          if (!this._playerCanFire) {
            return;
          }

          this._playerCanFire = false;

          var pos  = this._player.pos(),
              size = this._player.size();

          this._bullets.emit({
            x: pos.x + size.width / 2,
            y: pos.y
          });

          setTimeout(function(){
            this._playerCanFire = true;
          }.bind(this), 1000 / consts.BULLETS_PER_SECOND);
        },

        _onFrameDrawn : function() {
          this._calculatePenetrations();
        },

        _calculatePenetrations : function() {
          this._calculateCakesWithEnemiesPenetrations();
        },

        _calculateCakesWithEnemiesPenetrations : function() {
          var bullets = this._bullets.getObjects(),
              enemies = this._enemies.getObjects({ plain: true });

          var random = Math.floor(Math.random() * 100) + 1;
          var protect = random >=1 && random <= 33;

          var d = protect ? 100 : 0;

          if (bullets.length === 0 || enemies.length === 0) {
            return;
          }

          /*var collidedBullets = [],
              collidedEnemies = [];*/
          var collidedBullet,
              collidedEnemy;

          bullets.forEach(function(bullet, i){
            enemies.forEach(function(enemy, j){
              var bb = enemy.o.getBoundingBox(),
                  r1 = { x: bullet.x, y: bullet.y, w: bullet.w, h: bullet.h },
                  r2 = { x: enemy.x + bb.l * 2,  y: enemy.y - bb.t,  w: bb.w,  h: bb.h };

              if (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.h + r1.y > r2.y + d) {

                collidedBullet = i;
                collidedEnemy = j;
                /*if (collidedBullets.indexOf(i) === -1) {
                  collidedBullets.push(i);
                }

                if (collidedEnemies.indexOf(j) === -1) {
                  collidedEnemies.push(j);
                }*/
              }
            })
          });

          if (collidedBullet !== undefined && collidedEnemy !== undefined) {
            if (protect) {
              this._enemies.protectObject(collidedEnemy);
              setTimeout(function() {
                this._bullets.destroyObject(collidedBullet);
              }.bind(this), 200);
            } else {
              this._bullets.destroyObject(collidedBullet);
              this._enemies.destroyObject(collidedEnemy);
            }
          } else if (collidedBullet !== undefined) {
            this._bullets.destroyObject(collidedBullet);
          } else if (collidedEnemy !== undefined) {
            this._enemies.destroyObject(collidedEnemy);
          }

          /*collidedBullets = collidedBullets.sort(function(a, b){ return a < b });
          collidedEnemies = collidedEnemies.sort(function(a, b){ return a < b });

          collidedBullets.forEach(function(i){
            this._bullets.destroyObject(i);
          }.bind(this));

          collidedEnemies.forEach(function(i){
            this._enemies.destroyObject(i);
          }.bind(this));*/
        },

        _initPlayer : function() {
          if (!_.isNull(this._player)) {
            return;
          }

          this._player = new Player();
        },

        _initBullets : function() {
          if (!_.isNull(this._bullets)) {
            return;
          }

          this._bullets = new Bullets();
        },

        _initEnemies : function() {
          if (!_.isNull(this._enemies)) {
            return;
          }

          this._enemies = new Enemies();
        },

        _initCanvas : function() {
          if (!_.isNull(this._canvas)) {
            return;
          }

          this._canvas = new GameCanvas();

          this._canvas.addChild(this._player);
          this._canvas.addChild(this._bullets);
          this._canvas.addChild(this._enemies);

          this.el.append(this._canvas.getCanvas());
        }

      });

      provide(Game);
    });

}(this, this.modules));

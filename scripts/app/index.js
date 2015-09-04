(function(window, modules){

  document.addEventListener('DOMContentLoaded', function(){
    modules.require(['appInit'], function(appInit){
      appInit();
    });
  });

}(this, this.modules));
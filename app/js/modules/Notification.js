/**
 * Created by andriivandakurov on 11/13/13.
 */

var thinkTank = thinkTank || {};
thinkTank.Notification = {
  checkPermission:function(callback){
    if(window.Notification){
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          callback();
        }
      });
    }
  },
  show:function(title,options){
    this.checkPermission(function(){
      new Notification(title, options);
    });
  }
};
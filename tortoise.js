/*! tortoise 1.0.1 */
/*
 *
 */

var Tortoise = ( function( window, undefined ) {

  var progressBarHtml = '<div id="progress-bar-alert" class="progress"><div class="progress-bar progress-bar-striped active progress-bar-{{MSGTYPE}}" role="progressbar" aria-valuenow="{{PROGRESS}}" aria-valuemin="0" aria-valuemax="100" style="width: {{PROGRESS}}%"><span class="sr-only">{{PROGRESS}}% Complete</span></div></div>';
  var delayedMsgTimeouts = [];
  var options;
  var alert;

  function delayedMessage(alert, messageBody, oldProgressPercent, newProgressPercent, delay){
    delayedMsgTimeouts.push(setTimeout(function(e){
        msgType = "info";
        alert.update({
          message: messageBody + progressBarHtml.replace(/{{PROGRESS}}/g,oldProgressPercent).replace(/{{MSGTYPE}}/g,msgType),
          type: msgType
        });
        $(alert.el).find(".progress-bar").css('width');
        $(alert.el).find(".progress-bar").css('width',newProgressPercent+'%');
      },delay)
    );
  }

  function progressSequence(opts) {
    var msgType = "info",
        delays = [];
    alert = Messenger().post({
      message: progressBarHtml.replace(/{{PROGRESS}}/g,0),
      type: msgType
    });
    alert.options = $.extend({}, alert.options, opts)
    var duration = parseInt(alert.options.duration,10);
    var oldProgressPercent = 0, newProgressPercent = 0;
    $.each(alert.options.messages,function(i,obj){
      oldProgressPercent = newProgressPercent;
      newProgressPercent = parseInt(obj.percent,10);
      var delay = parseInt(obj.percent,10)/100 * duration;
      delayedMessage(alert, obj.message, oldProgressPercent, newProgressPercent, delay)
    });
    return alert;
  }

  function done(){
    if (delayedMsgTimeouts.length === 0) {
      console.log('no queued progress alert - exiting');
      return;
    }
    $.each(delayedMsgTimeouts,function(i,obj){
      clearTimeout(obj);
    });
    var lastMsg = alert.options.messages[alert.options.messages.length-1].message;
    delayedMessage(alert, lastMsg, 10, 100, 100)
    setTimeout(function(){
      alert.hide()
    },1000);
  }

  function myOtherMethod() {
    alert( 'my other method' );
  }

  return {
    progressSequence : progressSequence,
    done : done,
    someOtherMethod : myOtherMethod
  };

} )( window );

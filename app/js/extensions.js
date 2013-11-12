/**
 * Created by andriivandakurov on 10/26/13.
 */

thinkTank.wr.NodeList.prototype.extend = function(obj, options){
  // Extend obj with options
  if(options){
    for(var option in options){
      obj[option] = options[option];
    }
  }
  return obj;
};

thinkTank.wr.NodeList.prototype.expenses = function(options) {
  this.each(function(){
    // here 'this' is reference to dom element

    //Init plugin
    (new thinkTank.Expenses(options)).init(this, options.data || false);
  });
};

thinkTank.wr.NodeList.prototype.closest = function(parentNode,calback){
  return this.each(function(){
    var el = this;
    while(el){
      if( el.classList.contains(parentNode.replace('.', ''))
          || el.tagName.toLowerCase() == parentNode
          || el.getAttribute('id') == parentNode.replace('#', '')){ break;}

      el = el.parentNode;
    }
    calback(el);
  });
};
/**
 * Created by andriivandakurov on 10/26/13.
 */
var thinkTank = thinkTank || {};

/*
 * This is wrapper which get as parameter css selector,
 * find all nodes that matched and
 * create new object with all of them
 *
*/
thinkTank.wr = (function(){
  "use strict";

  function NodeList(elemsSelector) {
    if(!!elemsSelector){
      var self = this,
          nodeTarget = (typeof elemsSelector === 'string' ? document.querySelectorAll(elemsSelector) : elemsSelector);

      /*
      * If elemsSelector is a string - we get all nodes from document
      * and run callback for each of them
      *
      * If elemsSelector is a node - use its context
      * */
      if(nodeTarget.length && nodeTarget.length > 0){
        // Adding node elements to new object
        (function(nodeTarget){
          var i = self.length || 0;

          for(var ind in nodeTarget){
            // Check if elem is node
            if([nodeTarget[ind]] && nodeTarget[ind].nodeType == 1){
              self[i++] = nodeTarget[ind];
            }
           }

          // Adding attr like in jQuery object
          self.length = i;

          return this;
        })(nodeTarget);
      }
      else if(nodeTarget.nodeType && nodeTarget.nodeType == 1){
        (function(nodeTarget){
          var i = self.length || 0;
          self[i++] = nodeTarget;

          // Adding attr like in jQuery object
          self.length = i;
          return this;
        })(nodeTarget);
      }
    }
  }

  // Wrapper (its something like jQuery)
  function wr(elemsSelector) {
    return new NodeList(elemsSelector);
  }

  wr.NodeList = NodeList;

  NodeList.prototype.each = function(fn){
    for (var i = -1, l = this.length; ++i < l;) {
      fn.call(this[i], i, l, this);
    }
  };
  return wr;

})();

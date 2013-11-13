/**
 * Created by andriivandakurov on 10/26/13.
 */
var thinkTank = thinkTank || {};

thinkTank.Expenses = function(options){
  "use strict";

  var self = this,
      defaults = {
        target                : false,
        classActive           : 'open',
        classBtnRemove        : 'btn-expenses-remove',
        classHeader           : 'expenses-header',
        classPluginContainer  : 'expenses',
        classBtnAdd           : 'btn-expenses-add',

        templateMain          : 'expenses',
        templateListSingleEl  : 'expenses-list-single',


        selectorAddContainer  : '.expenses-dd-block-action-add',

        selectorList          : '.expenses-dd-list table',
        selectorPriceInput    : '.expenses-price'
      },
      activeElemsArr,
      targetElem,
      testData = [
        {"name":"breakfast", "price":13},
        {"name":"Pizza",  "price":5},
        {"name":"Lunch",  "price":20},
        {"name":"Coffee", "price":2},
        {"name":"Dinner", "price":32}
      ];

  thinkTank.wr().extend(defaults, options);

  activeElemsArr = [defaults.classHeader, defaults.classBtnRemove, defaults.classBtnAdd];

  // Handle all click events inside plugin container
  function handleClick(e,el,className){
    switch(className){
      //Handle btn add expenses click
      case defaults.classBtnAdd:
          self.addListElem();
        break;
      //Handle btn remove expenses click
      case defaults.classBtnRemove:

        self.removeListElem(e,el);
        break;
    }
    console.log('Click : ', el,className);
  }

  // Calculate total price of all elements in list
  function getTotalPrice(data){
    var totalPrice = 0;
    for(var el in data){
      totalPrice+=data[el]['price'];
    }
    return totalPrice;
  }


  this.addListElem = function(){
    if(!!targetElem){
      // Get data from inputs
      var allInputs = targetElem.querySelectorAll(defaults.selectorAddContainer+' input[name]'),
          data = {};

      for(var inputInd in allInputs){
        if(allInputs[inputInd].nodeType == 1){
          if(allInputs[inputInd].getAttribute('name').indexOf('name') > 0){
            data.name = allInputs[inputInd].value;
          }else{
            data.price = allInputs[inputInd].value;
          }
        }
      }
      if(data.name && data.price){
        // Add data to IndexedDb
        thinkTank.db.add({
          objStoreName      : 'expenses2',
          data:data,
          callbackOnSuccess : function(e){
            var htmlString
            // Id is a db track number
            data.id = e.target.result;
            htmlString = thinkTank.JST[defaults.templateListSingleEl](data);

            targetElem.querySelector(defaults.selectorList).insertAdjacentHTML('beforeend', htmlString);
          },
          callbackOnError : function(e){ console.warn("Error: ", e); }
        });
      }else{
        thinkTank.Notification.show('Please fill in all fields', {icon:'img/notification.png'});
      }
    }
  };

  this.removeListElem = function(e,el){
    var id = el.getAttribute('data-id');

    thinkTank.db.delete({
      objStoreName      : 'expenses2',
      id                : id,
      callbackOnSuccess : function(){
        thinkTank.wr(el).closest('tr', function(el){
          el.parentNode.removeChild(el);
        });
      }
    });

  };

  this.init = function(el, data){
    var wrapper = document.createElement('div'),
        data = data || testData;

    wrapper.innerHTML = thinkTank.JST[defaults.templateMain]({
      id   : el.getAttribute('id'),
      list : data
    });

    //Save reference to element
    targetElem = wrapper.firstChild;
    document.body.replaceChild(targetElem, el);

    // Handle click event
    targetElem.onclick = function(e){
      var el = e.target;
      while(el){
        for(var i in activeElemsArr){
          if(el.classList.contains(activeElemsArr[i])){
            handleClick(e, el, activeElemsArr[i]);
            el = false;
            break;
          }
        }
        el = (el == false || el.classList.contains(defaults.classPluginContainer)) ? false : el.parentNode;
      }
    };

    // Allow only numbers in price input
    targetElem.querySelector(defaults.selectorPriceInput).onkeypress = function(e){
      var theEvent = e || window.event,
          key = theEvent.keyCode || theEvent.which,
          regex = /[0-9]|\./;

      key = String.fromCharCode( key );
      if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
      }
    }

  };

};
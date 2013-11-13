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
        classSortBy           : 'sort-by',

        templateMain          : 'expenses',
        templateList          : 'expenses-list',
        templateListSingleEl  : 'expenses-list-single',


        selectorAddContainer  : '.expenses-dd-block-action-add',

        selectorList          : '.expenses-dd-list',
        selectorTotal         : '.expenses-total',
        selectorListTable     : '.expenses-dd-list table',
        selectorPriceInput    : '.expenses-price'
      },
      activeElemsArr,
      elemTarget,
      sortType = 1;// Descending

  thinkTank.wr().extend(defaults, options);

  activeElemsArr = [
    defaults.classHeader,
    defaults.classBtnRemove,
    defaults.classBtnAdd,
    defaults.classSortBy
  ];

  // Handle all click events inside plugin container
  function handleClick(e,el,className){
    switch(className){
      case defaults.classHeader:
        elemTarget.classList.toggle(defaults.classActive);
        break;
      //Handle btn add expenses click
      case defaults.classBtnAdd:
          self.addListElem();
        break;
      //Handle btn remove expenses click
      case defaults.classBtnRemove:
        self.removeListElem(e,el);
        break;
      case defaults.classSortBy:
        el.classList.toggle('active');
        self.sort(el.getAttribute('data-sort-by'));
        break;
    }
  }

  // Calculate total price of all elements in list
  function getTotalPrice(data){
    var totalPrice = 0;
    for(var el in data){
      totalPrice+=parseInt(data[el]['price']);
    }
    return totalPrice;
  }

  this.updateSum = function(data){
    elemTarget.querySelector(defaults.selectorTotal).innerHTML = getTotalPrice(data);
  };

  this.refreshList = function(){
    thinkTank.db.get({
      objStoreName      : 'expenses2',
      callbackOnSuccess : self.renderList
    });
  };

  this.addListElem = function(){
    if(!!elemTarget){
      // Get data from inputs
      var allInputs = elemTarget.querySelectorAll(defaults.selectorAddContainer+' input[name]'),
          data = {};

      for(var inputInd in allInputs){
        if(allInputs[inputInd].nodeType == 1){
          if(allInputs[inputInd].getAttribute('name').indexOf('name') > 0){
            data['name'] = allInputs[inputInd].value;
          }else{
            data['price'] = parseInt(allInputs[inputInd].value);
          }
        }
        //Clear input after add
        allInputs[inputInd].value='';
      }

      if(data.name && data.price){
        // Add data to IndexedDb
        thinkTank.db.add({
          objStoreName      : 'expenses2',
          data:data,
          callbackOnSuccess : self.refreshList,
          callbackOnError : function(e){ console.warn("Error: ", e); }
        });
      }else{
        thinkTank.Notification.show('Please fill in all fields', {icon:'img/notification.png'});
      }
    }
  };

  this.removeListElem = function(e,el){
    var self = this,
        id = el.getAttribute('data-id');
    thinkTank.db.delete({
      objStoreName      : 'expenses2',
      id                : id,
      callbackOnSuccess : self.refreshList
    });
  };

  this.renderList = function(dataList){
    var wrapper = document.createElement('div'),
        replaceTarget = elemTarget.querySelector(defaults.selectorList);

    wrapper.innerHTML = thinkTank.JST[defaults.templateList]({ list: dataList });
    replaceTarget.parentNode.replaceChild(wrapper.firstChild, replaceTarget);
    self.updateSum(dataList);
  };

  this.init = function(el, data){
    var wrapper = document.createElement('div'),
        data = data || testData;

    wrapper.innerHTML = thinkTank.JST[defaults.templateMain]({
      id   : el.getAttribute('id'),
      list : data
    });

    //Save reference to element
    elemTarget = wrapper.firstChild;
    document.body.replaceChild(elemTarget, el);
    self.updateSum(data);

    // Handle click event
    elemTarget.onclick = function(e){
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
    elemTarget.querySelector(defaults.selectorPriceInput).onkeypress = function(e){
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

  this.sort = function(sortBy){
    var self = this;
    thinkTank.db.get({
      objStoreName      : 'expenses2',
      callbackOnSuccess : function(data){
        // Select ascending or descending sorting
        sortType = ((sortType == 1) ? -1 : 1);
        data.sort(function(a,b){
          a = (typeof a == 'string') ? a[sortBy].toLowerCase() : a[sortBy];
          b = (typeof b == 'string') ? b[sortBy].toLowerCase() : b[sortBy];
          return a == b ? 0 : (a > b ? -1*sortType : 1*sortType);
        });
        self.renderList(data);
      }
    });

  }
};
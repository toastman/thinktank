/**
 * Created by andriivandakurov on 10/27/13.
 */
var thinkTank = thinkTank || {};

// Adding reference to IndexDb
thinkTank.db = {
  checkForSupport: function () {
    return "indexedDB" in window;
  },
  database: false,
  /*
   * options:{
   *   dbName            : ''
   *   dbVersion         : int
   *   objStoreName      : ''
   *   callbackOnSuccess : function(){}
   *   callbackOnError   : function(){}
   * }
   * */
  open: function (options) {

    // Check for IndexedDB support
    if (!this.checkForSupport) {
      console.warn('IndexedDB is not supported!');
      return;
    }

    var eventDbConnected = new Event('dbConnected'), // Creating event for something like pub/sub pattern
        request = indexedDB.open(options.dbName, options.dbVersion),
        self = this;

    request.onupgradeneeded = function (e) {
      var thisDB = e.target.result;

      if (!thisDB.objectStoreNames.contains(options.objStoreName)) {
        thisDB.createObjectStore(options.objStoreName, { autoIncrement: true });
      }
    };

    request.onsuccess = function (e) {
      console.log("Db connected.");
      self.database = e.target.result;

      document.dispatchEvent(eventDbConnected);
      return options.callbackOnSuccess ? options.callbackOnSuccess(e) : false;
    };

    request.onerror = function (e) {
      console.log("Error :", e);
      if (options.callbackOnError) {
        options.callbackOnError(e);
      }
    };
  },

  /*
   * options:{
   *   objStoreName      : ''
   *   callbackOnSuccess : function(){}
   *   callbackOnError   : function(){}
   * }
   * */
  add: function (options) {
    var self = this,
        addFunction = function () {
          var transaction = self.database.transaction([options.objStoreName], "readwrite"),
              store = transaction.objectStore(options.objStoreName),
              request = store.add(options.data);

          request.onerror = function (e) {
            console.warn("Error", e.target.error.name);
            return options.callbackOnError ? options.callbackOnError(e) : false;
          };

          request.onsuccess = function (e) {
            return options.callbackOnSuccess ? options.callbackOnSuccess(e) : false;
          };
        };

    this.database ? addFunction() : document.addEventListener('dbConnected', addFunction, false);
  },

  /*
   * options:{
   *   objStoreName      : ''
   *   callbackOnSuccess : function(){}
   *   callbackOnError   : function(){}
   * }
   * */
  delete: function (options) {
    var self = this,
        deleteFunction = function () {
          var transaction = self.database.transaction([options.objStoreName], "readwrite"),
              store = transaction.objectStore(options.objStoreName),
              request = store.delete(parseInt(options.id));

          request.onsuccess = function (e) {
            return options.callbackOnSuccess ? options.callbackOnSuccess(e) : false;
          };
        };

    this.database ? deleteFunction() : document.addEventListener('dbConnected', deleteFunction, false);
  },

  /*
   * options:{
   *   objStoreName      : ''
   *   callbackOnSuccess : function(){}
   *   callbackOnError   : function(){}
   * }
   * */
  get: function (options) {
    var self = this,
        dbData = [],
        getFunction = function (e) {
          var transaction = self.database.transaction([options.objStoreName], "readonly"),
              store = transaction.objectStore(options.objStoreName),
              cursorRequest = store.openCursor();

          cursorRequest.onerror = function () {
            console.warn("Error", e.target.error.name);
            return options.callbackOnError ? options.callbackOnError(e) : false;
          };

          cursorRequest.onsuccess = function (e) {
            var cursor = e.target.result;
            if (!!cursor == false) {
              return (options.callbackOnSuccess ? options.callbackOnSuccess(dbData) : false);
            } else {
//              console.log('cursor.value: ', JSON.parse(cursor.value));
              cursor.value.id = cursor.key;
              dbData.push(cursor.value);
              cursor.continue();
            }
          };

        };

    this.database ? getFunction() : document.addEventListener('dbConnected', getFunction, false);
  },

  /*
   * options:{
   *   objStoreName      : ''
   *   callbackOnSuccess : function(){}
   *   callbackOnError   : function(){}
   * }
   * */
  clear:function(options){
    var self = this,
        clearFunction = function(){
          var transaction = self.database.transaction([options.objStoreName], "readwrite"),
              store = transaction.objectStore(options.objStoreName),
              request = store.clear();

          request.onsuccess = function(e){
            console.log('objectStore ', options.objStoreName, ' is cleared.');
            return options.callbackOnSuccess ? options.callbackOnSuccess(e) : false;
          }
        };

    this.database ? clearFunction() : document.addEventListener('dbConnected', clearFunction, false);
  }
};

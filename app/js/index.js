/**
 * Created by andriivandakurov on 10/23/13.
 */

document.addEventListener("DOMContentLoaded", function() {
  // Init database
  thinkTank.db.open({
    dbName            : 'expensesDb2',
    dbVersion         : 2,
    objStoreName      : 'expenses2'
  });

  // Get data from db
  thinkTank.db.get({
    objStoreName      : 'expenses2',
    callbackOnSuccess : function(data){
      // Init plugin when all data is present
      thinkTank.wr('.js-expense').expenses({data:data});
//      thinkTank.wr('.expenses-dd-list').closest('tr');
    }
  });



},false);


this["thinkTank"] = this["thinkTank"] || {};
this["thinkTank"]["JST"] = this["thinkTank"]["JST"] || {};

this["thinkTank"]["JST"]["expenses-list-single"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <tr>\n    <td>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n    <td>\n      ";
  if (stack1 = helpers.price) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.price; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n      <a href=\"javascript:void(0)\" class=\"btn-expenses-remove\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">&times;</a>\n    </td>\n  </tr>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n  <tr>\n    <td>&nbsp;</td>\n    <td>&nbsp;</td>\n  </tr>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["thinkTank"]["JST"]["expenses-list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = self.invokePartial(partials['expenses-list-single'], 'expenses-list-single', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

  buffer += "<div class=\"expenses-dd-list\" data-list-rows=\"5\">\n  <table>\n    ";
  stack1 = helpers.each.call(depth0, depth0.list, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </table>\n</div>";
  return buffer;
  });

this["thinkTank"]["JST"]["expenses"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;


  buffer += "<div class=\"expenses open\" id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <header class=\"expenses-header\">Expenses</header>\n  <div class=\"expenses-dd\">\n    <table class=\"expenses-dd-header\">\n      <tr>\n        <th>\n          <a href=\"javascript:void(0)\" class=\"sort-by\" data-sort-by=\"name\">\n            Name\n          </a>\n        </th>\n        <th>\n          <a href=\"javascript:void(0)\" class=\"sort-by\" data-sort-by=\"price\">\n            Amount\n          </a>\n        </th>\n      </tr>\n    </table>\n    ";
  stack1 = self.invokePartial(partials['expenses-list'], 'expenses-list', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <table class=\"expenses-dd-block-action-add\">\n      <tr>\n        <td>\n          <input type=\"text\" name=\"expenses-name\">\n        </td>\n        <td class=\"no-wrap\">\n          $\n          <input type=\"text\" class=\"expenses-price\" name=\"expenses-price\" pattern=\"\\d*\">\n          <a href=\"#\" class=\"btn-expenses-add\">\n            <i class=\"icon-plus\"></i>\n          </a>\n        </td>\n      </tr>\n      <tr>\n        <td>Total</td>\n        <td>\n          <span class=\"expenses-total\"></span>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>";
  return buffer;
  });
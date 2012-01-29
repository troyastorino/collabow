var Action = function(method, type, id, attrs) {
  this.methods = method;
  this.type = type;
  this.id = id;
  this.attrs = attrs;
}

window.ActionTypes = {
  
};

window.Actions = [];

Backbone.sync = function(method, model, options) {
  var action = new Action(method, model.type);

  switch(method) {
  case "read":
    break;
  case "create":
    model.id = _.uniqueId();
    action.attrs = JSON.stringify(model.toJSON());
    break;
  case "update":
    action.attrs = JSON.stringify(model.toJSON());
    break;
  case "delete":
    break;
  case "patch":
    action.attrs = JSON.stringify(options.attrs);
    break;
  }

  action.id = model.id;

  window.Actions.push(action);
};

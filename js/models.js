// Dependencies: backbone.js, underscore.js

/* Attributes of Action:
  
  name: name of the action
  user: username of whoever did the action
  time: server time of action
  changed: map with properties that were changed as keys and the
           values they were changed to as values */
var Action = Backbone.Model.extend({
  validate: function() {
    if (!(this.get("name") && this.get("user") && this.get("time")))
      return "Cannot specifiy an Action without a name, user, or time.";
  }
});

var ActionList = Backbone.Collection.extend({
  model: Action,

  comparator: function(action) {
    return action.get("time");
  }
});

// Attributes: x, y, z, actions
   var Entity = Backbone.Model.extend({
  validate: function() {
    if (!(this.get("x") && this.get("y")))
      return "An Entity must have an x and y coordinate defined";
  },

  defaults: {
    actions: new ActionList,
    z: 0
  }
});

// Attributes: color, thickness
var Point = Entity.extend({
  defaults: {
    color: "black",
    thickness: 5
  }
});

// Attributes: height, width
var Rectangle = Entity.extend({
  validate: functions(){
    if (!(this.get("width") && this.get("height")))
      return "A Rectangle must have a width and height"
  }
});

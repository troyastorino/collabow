var Element = Backbone.Model.extend({
  initialize: function() {
    if (this.defaults) {
      this.defaults = _.defaults(this.defaults, Element.prototype.defaults);
    }
  },

  defaults: {
    selected: false,
  }
});

var Stroke = Backbone.Model.extend({
  addPoint: function(x, y) {
    if (this.get("path")) {
      this.get("path").push(["l", x - this.get("prevx"), y - this.get("prevy")]);

      // setting these triggers the change event so the render
      // function will fire
      this.set({
        prevx: x,
        prevy: y
      });
    } else {
      this.set({
        path: [["M", x, y]],
        x: x,
        y: y,
        prevx: x,
        prevy: y
      });
    }    
  },
  
  defaults: {
    stroke: "#000",
    "stroke-width": 5,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    
  },

  initialize: function() {
/*    this.set({
      id: uuid.v4(),
    });*/
  },

  set: function(attributes, options) {
    // if updating x and y, make sure to update path
    if (attributes.x && attributes.y && this.get("path"))
      this.get("path")[0] = ["M", attributes.x, attributes.y];

    Backbone.Model.prototype.set.call(this, attributes, options);
  }
});

var Rect = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0,
    width: 100,
    height: 70,
    stroke: "#000",
    "stroke-width": 2,
    fill: "#29e",
  }
});

var Elements = Backbone.Collection.extend({
  model: Element,
});

var Paper = Backbone.Model.extend({
  defaults: {
    elements: new Elements,
    selection: new Elements
  }
});

var Action = Backbone.Model.extend({
  
})
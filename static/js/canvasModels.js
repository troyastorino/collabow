var Element = Backbone.Model.extend({
  initialize: function() {
    if (this.defaults) {
      this.defaults = _.defaults(this.defaults, Element.prototype.defaults);
    }
  },

  defaults: {
    selected: false,
  },

});

var ElementCollection = Backbone.Collection.extend({
  model: Element
});

window.modelTypes = {
  STROKE: "Stroke",
  RECT: "Rect",
  IMG: "Img"
}

var Stroke = Element.extend({
  addPoint: function(x, y) {
    var path;
    if (path = this.get("path")) {
      path.push(["l", x - this.get("prevx"), y - this.get("prevy")]);
      this.patch({
        path: path
      });
      this.set({
        prevx: x,
        prevy: y
      });
    } else {
      this.set({
        prevx: x,
        prevy: y
      });
      this.patch({
        path: [["M", x, y]],
        x: x,
        y: y,
      });
    }    
  },
  
  defaults: {
    stroke: "#000",
    "stroke-width": 3,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  },

  set: function(attributes, options) {
    // if updating x and y, make sure to update path
    var path;
    if (attributes.x && attributes.y && (path = this.get("path")))
      path[0] = ["M", attributes.x, attributes.y];

    return Element.prototype.set.call(this, _.extend({}, attributes, {path: path}), options);
  },

  type: window.modelTypes.STROKE
});

var Rect = Element.extend({
  defaults: {
    x: 0,
    y: 0,
    width: 100,
    height: 70,
    stroke: "#000",
    "stroke-width": 1,
    fill: "#eee",
  },

  type: window.modelTypes.RECT,
});

var Img = Rect.extend({
  defaults: {
    x: 10,
    y: 10,
    src: "http://images.pictureshunt.com/pics/k/kitten-8363.jpg",
    width: 100,
    height: 200,
  },
  
  type: window.modelTypes.IMG,
});

// can't set key-value pairs in hash because would break on namespaced .
window.models = {};
window.models[window.modelTypes.STROKE] = Stroke;
window.models[window.modelTypes.RECT] = Rect;
window.models[window.modelTypes.IMG] = Img;




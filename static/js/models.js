var Stroke = Backbone.Model.extend({
  addPoint: function(x, y) {
    // relDists is an array of vectors pointing from the previous
    // point.
    var relDists;
    if (relDists = this.get("relDists")) {
      // push relative distance to relDists
      relDists.push([x - this.get("prevx"), y - this.get("prevy")]);

      // setting the prev point will also trigger the change event
      this.set({
        prevx: x,
        prevy: y
      });
    } else {
      this.set({
        x: x,
        y: y,
        // keep reference to "previous point" to calculate relative
        // distances
        prevx: x,
        prevy: y,
        relDists: []
      });
    }
  },
  
  defaults: {
    stroke: "#000",
    "stroke-width": 5,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  },

  get: function(attr) {
    // if attribute exists as a function in the model
    if (typeof this[attr] == 'function') {
      return this[attr]();
    }

    // default to normal get
    return Backbone.Model.prototype.get.call(this, attr);
  },

  initialize: function() {
/*    this.set({
      id: uuid.v4(),
    });*/
  },

  path: function() {
    var path = "", relDists;
    if (relDists = this.get("relDists")) {
      path +=  "M" + this.get("x") + "," + this.get("y");
      for (var i = 0, ii = relDists.length; i < ii; i +=1) {
        var point = relDists[i];
        path += "l" + point[0] + "," + point[1];
      }
    }
    return path;
  },
});

var Rect = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0,
    width: 100,
    height: 70,
    stroke: "#000",
    "stroke-width": 2,
    fill: "#eee",
  }
});

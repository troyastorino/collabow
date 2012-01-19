var Point = Backbone.Model.extend({});

var PointCollection = Backbone.Collection.extend({
  model: Point
});

var Stroke = Backbone.Model.extend({
  defaults: {
    color: "#000000",
    thickness:5
  },

  initialize: function() {
    this.points = new PointCollection;
    this.add = this.points.add;
  }
});

var StrokeCollection = Backbone.Collection.extend({
  model: Stroke
});

var Point = Backbone.Model.extend({});

var PointCollection = Backbone.Collection.extend({
  model: Point
});

var Stroke = Backbone.Model.extend({
  defaults: {
    color: "#000000",
    thickness:5,
    points: new PointCollection()
  },

  initialize: function() {
    this.set({id: uuid.v4()});
    // this.add = this.points.add;
  }
});

var StrokeCollection = Backbone.Collection.extend({
  model: Stroke
});

var Rectangle = Backbone.Model.extend({
  defaults: {
    x: undefined,
    y: undefined,
    width: 100,
    height: 70
  }
});

var RectangeCollection = Backbone.Collection.extend({
  model: Rectangle
})

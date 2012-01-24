var _ = require('underscore'),
    Backbone = require('backbone');

var Point = exports.Point = Backbone.Model.extend({});

var PointCollection = exports.PointCollection = Backbone.Collection.extend({
  model: Point
});

var Stroke = exports.Stroke = Backbone.Model.extend({
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

var StrokeCollection = exports.StrokeCollection = Backbone.Collection.extend({
  model: Stroke
});

var Rectangle = exports.Rectangle = Backbone.Model.extend({
  defaults: {
    x: undefined,
    y: undefined,
    width: 100,
    height: 70
  }
});

var RectangeCollection = exports.RectangleCollection = Backbone.Collection.extend({
  model: Rectangle
});
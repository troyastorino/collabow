var underscore = require('underscore')._,
    backbone = require('backbone');

var Point = exports.Point = backbone.Model.extend({});

var PointCollection = exports.PointCollection = backbone.Collection.extend({
  model: Point;
});

var Stroke = exports.Stroke = backbone.Model.extend({
  defaults: {
    color: "#000000",
    thickness:5
  },

  initialize: function() {
    this.points = new PointCollection;
  },

  addPoint: this.points.add,
});

var StrokeCollection = exports.StrokeCollection = backbone.Collection.extend({
  model: Stroke
});

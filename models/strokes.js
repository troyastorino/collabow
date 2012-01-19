var _ = require('underscore'),
    Backbone = require('backbone');

var Point = exports.Point = backbone.Model.extend({});

var PointCollection = exports.PointCollection = backbone.Collection.extend({
  model: Point
});

var Stroke = exports.Stroke = backbone.Model.extend({
  defaults: {
    color: "#000000",
    thickness:5
  },

  initialize: function() {
    this.points = new PointCollection;
  },
});

var StrokeCollection = exports.StrokeCollection = backbone.Collection.extend({
  model: Stroke
});

var _ = require('underscore'),
    Backbone = require('backbone'),
    strokes = require('./../collabow/models/strokes.js');

var CanvasView = Backbone.View.extend({
  drawStroke: function(stroke) {
    this.context.beginPath();

    // go to first point in stroke
    var start = stroke.points.first();
    this.context.moveTo(start.get("x"), start.get("y"));

    // loop through all other points
    for (var point in stroke.points.rest()) {
      this.context.lineTo(point.get("x"), point.get("y"));
    }

    // set context
    this.context.lineWidth = stroke.thickness;
    this.context.strokeStyle = stroke.color;

    // stroke path
    this.context.stroke();  
  },

  el: $("canvas")[0],

  events: {
    "mousedown" : "beginDraw",
    "mouseup"   : "finishDraw",
    "mousemove" : "checkDraw"
  },

  initialize: function() {  
    _.bindAll(this, 'beginDraw', 'finishDraw', 'checkDraw', 'render');

    // Sets the context for the canvas
    this.context = this.el.getContext("2d"); 
    
    this.strokeCollection = new StrokeCollection;
    this.strokeCollection.bind('change', this.render);
    
    this.mouseDown = false;
  },

  render: function() {
    this.strokeCollection.each(drawStroke, this);
  }
});


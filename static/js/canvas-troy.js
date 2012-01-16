var CanvasView = Backbone.View.extend({
  drawStroke: function(stroke) {
    this.context.beginPath();

    // go to first point in stroke
    var start = stroke.points.first();
    this.context.moveTo(start.get("x"), start.get("y"));

    // loop through all other points
    _.each(stroke.points.rest(), function(point) {
      this.context.lineTo(point.get("x"), point.get("y"));
    }, this);

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
      this.resize();
      
    _.bindAll(this, 'beginDraw', 'finishDraw', 'checkDraw', 'render', 'resize', 'drawStroke');
    
    // Sets the context for the canvas
    this.context = this.el.getContext("2d"); 
    
    this.strokeCollection = new StrokeCollection;
//    this.strokeCollection.bind('change', this.render);
    
    this.mouseStatus = false;
  },

  render: function() {
    this.strokeCollection.each(this.drawStroke, this);
  },

 resize: function() {
   //gets values from window size
   var x = $(window).width() - 40;
   var y = $(window).height() - 140;

   //grab div element and create canvas with variables
   $(this.el).height(y+"px");
   $(this.el).width(x+"px");
 },

  // On MouseDown begin to draw
  beginDraw: function(e) {
    this.mouseStatus = true;
    this.currentStroke = new Stroke;
    this.strokeCollection.add(this.currentStroke);
    this.currentStroke.points.add({x: e.pageX,
                            y: e.pageY});
  },

  // On MouseUp finish drawing
  finishDraw: function(e) {
    this.mouseStatus = false;
    this.currentStroke = null;
  },

  // When mouse moves, check if it is drawing and if so draw a line.
  checkDraw: function(e) {
    if(this.mouseStatus) {
      this.currentStroke.points.add({x: e.pageX,
                              y: e.pageY});
      this.render();
    }
  }
});

$(function() {
  var canvasView = new CanvasView;
});

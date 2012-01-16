$(document).ready(function(){
  var socket = io.connect("http://localhost");

  var CanvasView = Backbone.View.extend({
    el: $("canvas")[0],
    
    events: {
      "mousedown" : "beginDraw",
      "mouseup"   : "finishDraw",
      "mousemove" : "checkDraw"
    },

    initialize: function() {
      _.bindAll(this, 'beginDraw', 'finishDraw', 'checkDraw', 'render');
      
      this.pointCollection = new PointCollection();
      this.strokeCollection  = new StrokeCollection();
      this.pointCollection.bind('add', this.render);
      this.strokeCollection.bind('add',this.render);
      
      this.mouseStatus = false;
      // Sets the context for the canvas
      this.context = this.el.getContext("2d"); 
      this.render();
    },

    resize: function() {
      //gets values from window size
      var x = $(window).width() - 40;
      var y = $(window).height() - 40;

      //grab div element and create canvas with variables
      $(this.el).height(y+"px");
      $(this.el).width(x+"px");
    },
    
    render: function() {
      // clear
      this.el.width = this.el.width;
      // Checking
      // to see if points have already been drawn

      var pre;
      // For each individual stroke
      _.each(this.pointCollection.models, function(point) {
        // Set line width
        this.context.lineWidth = 5;
        // Set point to pre for futrue
        if (pre) { this.context.moveTo(pre.get("x"),pre.get("y")); }
        else { this.context.moveTo(point.get("x"),point.get("y")); }
        pre = point;
        this.context.lineTo(point.get("x"),point.get("y"));
        this.context.closePath();
        this.context.stroke();
      }, this);
      
      _.each(this.strokeCollection.models, function(stroke) {
        var pre = undefined;
        _.each(stroke.get("points").models, function(point) {
          // Set line width
          this.context.lineWidth = 5;
          // Set point to pre for future
          if (pre) { this.context.moveTo(pre.get("x"),pre.get("y")); }
          else { this.context.moveTo(point.get("x"),point.get("y")); }
          pre = point;
          this.context.lineTo(point.get("x"),point.get("y"));
          this.context.closePath();
          this.context.stroke();
        }, this);
      }, this);      
    },   

    // On MouseDown begin to draw
    beginDraw: function(e) {
      this.mouseStatus = true;
      this.pointCollection = new PointCollection();
      this.pointCollection.bind('add', this.render);
      var mouseX = e.pageX;
      var mouseY = e.pageY;
      this.pointCollection.add({x:mouseX,
                       y:mouseY});
    },

    // On MouseUp finish drawing
    finishDraw: function(e) {
      this.mouseStatus = false;
      var self = this;
      this.stroke = new Stroke({points:self.pointCollection});
      this.strokeCollection.add(this.stroke);
      socket.emit('addStroke', this.stroke.attributes);
    },

    // When mouse moves, check if it is drawing and if so draw a line.
    checkDraw: function(e) {
      if(this.mouseStatus) {
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        this.pointCollection.add({x:mouseX,
                         y:mouseY});
      }  
    }
  });

  window.canvasView = new CanvasView;

  socket.on('addStroke', function(stroke) {
    console.log(stroke);
    window.canvasView.strokeCollection.add(stroke);
  })
});


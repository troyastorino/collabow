$(document).ready(function(){
  var socket = io.connect("http://localhost");

  var CanvasView = Backbone.View.extend({
    tagName: "canvas",
    
    events: {
      "mousedown" : "beginDraw",
      "mouseup"   : "finishDraw",
      "mousemove" : "checkDraw",
      "dblclick"  : "drawRectangle"
    },
    
    initialize: function() {     
      
      _.bindAll(this, 'beginDraw', 'finishDraw', 'checkDraw', 'drawRectangle', 'render');
      
      this.pointCollection = new PointCollection();
      this.strokeCollection  = new StrokeCollection();
      this.pointCollection.bind('add', this.render);
      this.strokeCollection.bind('add',this.render);
   //   this.strokeCollection.bind('add',function(stroke) {
   //     console.log(stroke.get("points"));
   //     stroke.get("points").bind('add',this.render)
   //   });
      this.strokeCollection.bind('set',this.render);
      
      this.mouseStatus = false;
      // Sets the context for the canvas
      $("#canvas").html(this.el);
      this.context = this.el.getContext("2d");
      this.resize();
      this.render();
    },

    render: function() {
      // Clear canvas
      this.el.width = this.el.width;


      // Draw the entire collection of Strokes
      _.each(this.strokeCollection.models, function(stroke) {
        this.drawStroke2(stroke);
      }, this);      
    },

    renderRect: function() {
      
    },

    resize: function() {
      //gets values from window size
      var x = $(window).width() - 40;
      var y = $(window).height() - 60;
      
      //grab div element and create canvas with variables
      this.context.canvas.height = y;
      this.context.canvas.width = x;
      
    },
    
    // (context, size) - Sets to lineWidth to be given size
    setLineWidth: function(context, size) {
      context.lineWidth = size;
    },

    drawStroke2: function(stroke) {
      if (stroke.get("points").rest()) 
      
      this.context.beginPath();

      // Get the starting point in the stroke
      var start = stroke.get("points").first();
      this.context.moveTo(start.get("x"),start.get("y"));

      // Draw the remaining points in stroke - models??
      _.each(stroke.get("points").rest(), function(point) {
        this.context.lineTo(point.get("x"),point.get("y"));
      }, this);

      // Set attributes of the stroke: color, thickness
      this.context.lineWidth = stroke.get("thickness");
      this.context.strokeStyle = stroke.color;
      this.context.linejoin = "round";

      // Draw stroke on canvas
      this.context.stroke();
      
    },

    // On MouseDown begin to draw
    beginDraw: function(e) {
      // Sets mouseStatus to TRUE for the entirety of the stroke
      this.mouseStatus = true;
      
      // Creates a new PointCollection when drawing a new stroke and
      // binds render for every add to the pointCollection.
      this.pointCollection = new PointCollection();
      this.pointCollection.bind('add', this.render);

      //  Add point to pointCollection
      this.stroke = new Stroke({points:this.pointCollection});
      this.addMouseToPoints(e, this.pointCollection)
      this.strokeCollection.add(this.stroke);
    },

    // On MouseUp finish drawing
    finishDraw: function(e) {
      // Set mouseStatus to FALSE so no more drawing occurs
      this.mouseStatus = false;

      // Send stroke to server
//      socket.emit('addStroke', this.stroke.attributes);
    },

    // When mouse moves, check if it is drawing and if so draw a line.
    checkDraw: function(e) {
      if(this.mouseStatus) {
        this.addMouseToPoints(e, this.pointCollection);
      }
    },

    // Add the current mouse location to points.
    addMouseToPoints: function(e, points) {
      var mouseX = e.pageX-20;
      var mouseY = e.pageY-42;
      points.add({x:mouseX,
                  y:mouseY});
      socket.emit('addPoint', {
        point: {
          x: mouseX,
          y: mouseY
        },
        test: "blah",
        strokeId: this.stroke.get("id")
      });
    },

    drawRectangle : function(e) {
      var mouseX = e.pageX;
      var mouseY = e.pageY;
      
    }
  });

  window.canvasView = new CanvasView;

  socket.on('addPoint', function(data) {
    var collection = window.canvasView.strokeCollection, stroke;
    if (stroke = collection.get(data.strokeId)) {
      stroke.get("points").add(new Point(data.point));
      window.canvasView.render();
    } else {
      stroke = new Stroke();
      stroke.set({id: data.strokeId});
      window.canvasView.strokeCollection.add(stroke);
      stroke.set({points: new PointCollection(data.point)});
      stroke.get("points").bind("add",window.canvasView.render);
    }

    // color
    
    
  })
});


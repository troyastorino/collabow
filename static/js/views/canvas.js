var CanvasView = require("./../views/canvas.js");

$(document).ready(function(){
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
  });
});

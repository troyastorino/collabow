var ElementView  = Backbone.View.extend({
  initialize: function() {
    // create reference to Raphael object in addition to DOM element
    this.element = this.options.element;
    this.element.view = this;
    this.el = this.element.node;

    // bind to changes in the model
    this.model.bind("change", this.render, this);
    this.model.bind("destroy", this.remove, this);

    // enable dragging
    this.element.drag(this.dragMove, this.dragStart,
                     this.dragFinish, this, this, this);

    // set glow on mouseover
    /*this.element.hover(function() {
        this.g = this.glow({
          color: "#4D90FE",
          width: 5
        });
      }, function() {
        this.g.remove();
      }
    )*/

    // delegate events and render
    if (this.events) this.delegateEvents(this.events);
    this.render();
  },

  destroyModel: function() {
    this.model.destroy();
  },

  dragStart: function() {
    this.ox = this.model.get("x");
    this.oy = this.model.get("y");
    this.element.toFront();
  },

  dragFinish: function() {

  },
  
  dragMove: function(dx, dy) {
    var newPose = {
      x: this.ox + dx,
      y: this.oy + dy
    }
    this.model.set(newPose);
/*    // if a glow element exists also move the glow element
    if (this.g) this.g.attr(newPose);*/
  },

  remove: function() {
    this.element.remove();
  }
});

var StrokeView = ElementView.extend({
  events: {
    "mousemove": "handleMove"
  },

  handleMove: function() {
    if (window.state.mode === window.modes.ERASE && window.state.mousedown) {
      this.remove();
    }
  },
  
  render: function() {
    this.element.attr({
      path: this.model.get("path"),
      stroke: this.model.get("stroke"),
      "stroke-width": this.model.get("stroke-width"),
      "stroke-linecap": this.model.get("stroke-linecap"),
      "stroke-linejoin": this.model.get("stroke-linejoin")
    });
    return this;
  }
});

var RectView = ElementView.extend({
  render: function() {
    this.element.attr({
      x: this.model.get("x"),
      y: this.model.get("y"),
      fill: this.model.get("fill"),
      stroke: this.model.get("stroke"),
      "stroke-width": this.model.get("stroke-width"),
      width: this.model.get("width"),
      height: this.model.get("height")
    });
    return this;
  }
})

var AppView = Backbone.View.extend({
  addRect: function() {
    var view = new RectView({
      element: this.paper.rect(),
      model: new Rect(),
    });
    return view.element;
  },

  addPoint: function(e) {
    this.currentStroke.addPoint(e.offsetX, e.offsetY);
  },

  downHandler: function(e) {
    window.state.mousedown = true;
    switch (window.state.mode) {
    case window.modes.DRAW:
      if (e.target.nodeName === this.paperName) {
        this.startStroke(e); 
      }
      break;
    case window.modes.ERASE:

      break;
    }
  },

  el: "#paper",


  events: {
    "click #addRect": "addRect",
    "click #drawMode": "setDrawMode",
    "click #eraseMode": "setEraseMode",
    "mousedown" : "downHandler",
    "mousemove" : "moveHandler",
    "mouseup" : "upHandler"
  },

  initialize: function() {
    this.paper = new Raphael(this.el, 1000, 250);

    this.currentStroke = null;

    window.modes = {
        ERASE: "erase",
        DRAW: "draw",
    };
    
    window.state = {
      mode: window.modes.DRAW,
      mousedown: false,
    };
  },

  moveHandler: function(e) {
    switch (window.state.mode) {
    case window.modes.DRAW:
      if (this.currentStroke) {
        this.addPoint(e);
      }
      break;
    case window.modes.ERASE:
      if (window.state.mousedown) {

      }
      break;
    }
  },

  paperName: "svg",

  setDrawMode: function() {
    window.state.mode = window.modes.DRAW;
  },

  setEraseMode: function() {
    window.state.mode = window.modes.ERASE;
  },

  startStroke: function(e) {
    var view = new StrokeView({
      element: this.paper.path(),
      model: new Stroke
    });
    this.currentStroke = view.model;
    this.addPoint(e);
  },

  upHandler: function(e) {
    window.state.mousedown = false;
    switch (window.state.mode) {
    case window.modes.DRAW:
      if (this.currentStroke) {
        this.addPoint(e);
        this.currentStroke = null;
      }
      break;
    case window.modes.ERASE:

      break;
    }
  },

});

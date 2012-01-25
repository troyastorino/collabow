var utils = {
  elementDragStart: function() {
    this.ox = this.model.get("x");
    this.oy = this.model.get("y");
    this.element.toFront();
  },

  elementDragFinish: function() {

  },
  
  elementDragMove: function(dx, dy) {
    this.model.set({
      x: this.ox + dx,
      y: this.oy + dy
    });
  },

  makeDraggable: function(element) {
    // if has length, it is a set
    if (element.length) {

    } else {
      element.drag(utils.elementDragMove, utils.elementDragStart, utils.elementDragFinish,
                      element.view, element.view, element.view);
    return element;
    }
  },

  makeUndraggable: function(element) {
    element.undrag();

    return element;
  },
  
  setDragStart: function(x, y, event) {
    this.forEach(function(element) {
      element.ox;
      element.oy = y;
    });
  },  
};

var ElementView  = Backbone.View.extend({
  initialize: function() {
    // create reference to Raphael object in addition to DOM element
    this.element = this.options.element;
    this.element.view = this;
    this.el = this.element.node;

    // bind to changes in the model
    this.model.bind("change", this.render, this);
    this.model.bind("destroy", this.remove, this);

    // add events in child
    if (this.events) {
      this.events = _.defaults(this.events, ElementView.prototype.events);
    }
    
    // delegate events and render
    if (this.events) this.delegateEvents(this.events);
    this.render();
  },

  downHandler: function() {
    switch (window.state.mode) {
    case window.modes.SELECT:
      this.model.set({
        selected: !this.model.get("selected"),
      });
    }
  },

  destroyModel: function() {
    this.model.destroy();
  },

  events: {
    "click": "downHandler",
  },

  remove: function() {
    this.element.remove();
  },

  render: function() {

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

    // add glow for selection
    if (this.model.get("selected")) {
      if (!this.glow) this.glow = this.element.glow({
        color: "#4D90FE",
        width: 8
      });
      this.glow.attr({
        path: this.model.get("path"),
      });
    } else {
      if (this.glow) {
        this.glow.remove();
        this.glow = null;
      }
    }
    
    return this;
  }
});

var RectView = ElementView.extend({
  render: function() {
    // draw rectangle
    this.element.attr({
      x: this.model.get("x"),
      y: this.model.get("y"),
      fill: this.model.get("fill"),
      stroke: this.model.get("stroke"),
      "stroke-width": this.model.get("stroke-width"),
      width: this.model.get("width"),
      height: this.model.get("height")
    });

    // add glow for selection
    if (this.model.get("selected")) {
      if (!this.glow) this.glow = this.element.glow({
        color: "#4D90FE",
        width: 10
      });
      var path = [
        ["M", this.model.get("x"), this.model.get("y")],
        ["l", this.model.get("width"), 0],
        ["l", 0, this.model.get("height")],
        ["l", -(this.model.get("width")), 0],
        ["z"]
      ];
      this.glow.forEach(function(element) {
        element.attr({
          path: path
        })
      });
    } else {
      if (this.glow)  {
        this.glow.remove();
        this.glow = null;
      }
    }
    
    return this;
  }
});

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

  clearCurrentMode: function() {
    switch(window.state.mode){
    case window.modes.DRAW:

      break;
    case window.modes.SELECT:
      this.paper.forEach(function(element) {
        utils.makeUndraggable(element);
      });
      window.state.currentSelection.clear();
      break;
    case window.modes.ERASE:

      break;
    case window.modes.TEXT:

      break;
    }
  },

  downHandler: function(e) {
    window.state.mousedown = true;
    switch (window.state.mode) {
    case window.modes.DRAW:
      this.startStroke(e); 
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
    "click #selectMode": "setSelectMode",
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
        SELECT: "select",
        TEXT: "text"
    };
    
    window.state = {
      mode: window.modes.DRAW,
      mousedown: false,
      currentSelection: this.paper.set(),
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
    this.clearCurrentMode();
    window.state.mode = window.modes.DRAW;
  },

  setEraseMode: function() {
    this.clearCurrentMode();
    window.state.mode = window.modes.ERASE;
  },

  setSelectMode: function() {
    this.clearCurrentMode();

    this.paper.forEach(function(element) {
      utils.makeDraggable(element);
    });

    window.state.mode = window.modes.SELECT;
  },

  startStroke: function(e) {
    var view = new StrokeView({
      element: this.paper.path(),
      model: new Stroke,
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

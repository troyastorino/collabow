var utils = {
  makeSetDraggable: function(set) {
    set.drag(utils.setDragMove, utils.setDragStart, utils.setDragFinish, set, set, set);
    return set
  },

  makeSetUndraggable: function(set) {
    set.undrag();
    return set;
  },

  setDragStart: function() {
    this.forEach(function(element) {
      element.ox = element.view.model.get("x");
      element.oy = element.view.model.get("y");
    });
  },

  setDragFinish: function() {
    this.forEach(function(element) {
      element.ox = element.oy = undefined;
    });
  },

  setDragMove: function(dx, dy) {
    this.forEach(function(element) {
      element.view.model.set({
        x: element.ox + dx,
        y: element.oy + dy
      });
    });
  },
};

var ElementView  = Backbone.View.extend({
  destroyModel: function() {
    this.model.destroy();
  },

  downHandler: function() {
    this.clickedDown = true;
    switch(window.state.mode) {
    case window.modes.SELECT:

      break;
    }
  },

  events: {
//    "keyup": "keyHandler",
    "mousedown":"downHandler",
    "mousemove": "moveHandler",
    "mouseup": "upHandler"
  },

  initialize: function() {
    // create reference to Raphael object in addition to DOM element
    this.element = this.options.element;
    this.element.view = this;
    this.el = this.element.node;

    // bind to changes in the model
    this.model.bind("change", this.render, this);
//    this.model.bind("change", this.save, this);
    this.model.bind("destroy", this.remove, this);

    // initialize reference variables
    this.clickedDown = false;
    this.dragging = false;

    // add events in child
    if (this.events) {
      this.events = _.defaults(this.events, ElementView.prototype.events);
    }
        
    // delegate events and render
    if (this.events) this.delegateEvents(this.events);
    this.render();
  },

/* Keyboard events don't fire on the SVG element...
  keyHandler: function(event) {
    switch(window.state.mode) {
    case window.modes.SELECT:
      // if backspace or delete
      if (event.which === 8 || event.which === 46) {
        window.state.currentSelection.forEach(function(element) {
          element.view.model.destroy();
        });
      }
    }
  },*/
  
  moveHandler: function() {
    switch(window.state.mode) {
    case window.modes.SELECT:
      if (this.clickedDown) {
        this.dragging = true;
      }
      break;
    }
  },

  upHandler: function() {
    switch(window.state.mode) {
    case window.modes.SELECT:
      if (this.clickedDown) {
        var selected = this.model.get("selected");
        if (selected) {
          if (!this.dragging) {
            this.model.set({selected: false});
            window.state.currentSelection.exclude(this.element);
          }
        } else {
          this.model.set({selected: true});
          window.state.currentSelection.push(this.element);
        }
      }

      // make global selection draggable
      utils.makeSetDraggable(window.state.currentSelection);

    }
    this.clickedDown = this.dragging = false;
  },

  remove: function() {
    if (this.glow) this.glow.remove();
    this.element.remove();
  },

  render: function() {

  }
});

var StrokeView = ElementView.extend({
/*  events: {
    "mousemove": "handleStrokeMove"
  },*/

  handleStrokeMove: function() {
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
      "strokpe-linejoin": this.model.get("stroke-linejoin")
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
      window.state.currentSelection.forEach(function(element) {
        element.view.model.set({selected: false});
      });
      window.state.currentSelection.clear();
      break;
    case window.modes.ERASE:

      break;
    case window.modes.TEXT:

      break;
    }
  },

  delete: function() {
    window.state.currentSelection.forEach(function(element) {
      element.view.model.destroy();
    });
    window.state.currentSelection.clear();
  },

  downHandler: function(e) {
    window.state.mousedown = true;
    switch (window.state.mode) {
    case window.modes.DRAW:
      this.startStroke(e); 
      break;
    case window.modes.ERASpE:

      break;
    }
  },

  el: "#paper",


  events: {
    "click #addRect": "addRect",
    "click #delete": "delete",
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
      currentSelection: this.paper.set()
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

/*    this.paper.forEach(function(element) {
      utils.makeDraggable(element);
    });*/

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

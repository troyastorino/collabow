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
      element.view.model.patch({
        x: element.ox + dx,
        y: element.oy + dy
      });
    });
  },

  touchify: function(events) {
    var eventsMap = {
      'click': 'touchstart',
      'mousedown': 'touchstart',
      'mousemove': 'touchmove',
      'mouseup': 'touchend'
    };
    _.each(events, function(value, key) {
      _.each(eventsMap, function(eventVal, eventKey) {
        var regex = new RegExp(eventKey);
        if (regex.test(key)) {
          events[key.replace(regex, eventVal)] = value;
          delete events[key];
        }
      });
    });
  }
};

var ElementView  = Backbone.View.extend({
  downHandler: function() {
    this.clickedDown = true;
    switch(window.state.mode) {
    case window.modes.SELECT:

      break;
    }
  },

  events: {
//    "keyup": "keyHandler",
    "mousedown.element":"downHandler",
    "mousemove.element": "moveHandler",
    "mouseup.element": "upHandler"
  },

  initialize: function(attrs, options) {
    // create reference to Raphael object in addition to DOM element
    this.element = this.options.element;
    this.element.view = this;
    this.setElement(this.element.node, false);

    // add to global list of elements
    window.state.elements.add(this.model);
    
    // bind to changes in the model
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.remove, this);

    // initialize reference variables
    this.clickedDown = false;
    this.dragging = false;

    // add touch events
    if (Modernizr.touch) utils.touchify(this.events);
    this.delegateEvents();

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
            this.model.patch({selected: false});
            window.state.currentSelection.exclude(this.element);
          }
        } else {
          this.model.patch({selected: true});
          window.state.currentSelection.push(this.element);
        }
      }

      // make global selection draggable
      utils.makeSetDraggable(window.state.currentSelection);

    }
    this.clickedDown = this.dragging = false;
  },

  remove: function() {
    window.state.elements.remove(this.model);
    if (this.glow) this.glow.remove();
    this.element.remove();
  },

  render: function() {

  },

  
});

var StrokeView = ElementView.extend({
  handleStrokeMove: function() {
    if (window.state.mode === window.modes.ERASE && window.state.mousedown) {
      this.model.destroy();
    }
  },

  initialize: function() {
    this.events = _.extend({}, this.events, {
      "mousemove.stroke": "handleStrokeMove"
    });

    ElementView.prototype.initialize.call(this);
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
  renderGlow: function() {
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
  },

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
    this.renderGlow();
    
    return this;
  }
});

var ImgView = RectView.extend({
  render: function() {
    this.element.attr({
      x: this.model.get("x"),
      y: this.model.get("y"),
      src: this.model.get("src"),
      width: this.model.get("width"),
      height: this.model.get("height")
    });

    // add glow
    this.renderGlow();

    return this;
  }
});

// can't set key-value pairs in hash because would break on namespaced .
window.views = {};
window.views[window.modelTypes.STROKE] = StrokeView;
window.views[window.modelTypes.RECT] = RectView;
window.views[window.modelTypes.IMG] = ImgView;

var AppView = Backbone.View.extend({
  changeColor: function() {
    
  },
  
  addImage: function() {
    // Create a temperary image for height and width
    var tempImg = new Image();
    tempImg.src = $("#url").val();
    
    var view = new ImgView({
      element : this.createElement(window.modelTypes.IMG),
      model: new Img(),
    });
    view.model.save({
      width: tempImg.width,
      height: tempImg.height,
      src: $("#url").val(),
    });
    return view.element;
  },
  
  addRect: function() {
    var view = new RectView({
      element: this.createElement(window.modelTypes.RECT),
      model: new Rect(),
    });
    view.model.save();
    return view.element;
  },

  addPoint: function(e) {
    (e.originalEvent || e).preventDefault();
    var x = e.pageX || e.originalEvent.pageX,
        y = e.pageY || e.originalEvent.pageY;
    this.currentStroke.addPoint(x - window.state.svgX, y - window.state.svgY, {updateServer: true});
  },

  clearCurrentMode: function() {
    switch(window.state.mode) {
    case window.modes.DRAW:

      break;
    case window.modes.SELECT:
      window.state.currentSelection.forEach(function(element) {
        element.view.model.patch({selected: false});
      });
      window.state.currentSelection.clear();
      break;
    case window.modes.ERASE:

      break;
    case window.modes.TEXT:

      break;
    } 
  },

  createElement: function(modelType) {
    switch(modelType) {
    case window.modelTypes.STROKE:
      return this.paper.path();
      break;
    case window.modelTypes.RECT:
      return this.paper.rect();
      break;
    case window.modelTypes.IMG:
      return this.paper.image();
      break;
    }
  },

  delete: function() {
    window.state.currentSelection.forEach(function(element) {
      var model = element.view.model;
      model.destroy();
    });
    window.state.currentSelection.clear();
  },

  downHandler: function(e) {
    window.state.mousedown = true;
    window.state.downEvent = e;
    switch (window.state.mode) {
    case window.modes.DRAW:

      break;
    case window.modes.ERASE:

      break;
    }
  },

  el: "#paper",


  events: {
    "click #addImage": "addImage",
    "click #addRect": "addRect",
    "click #delete": "delete",
    "click #drawMode": "setDrawMode",
    "click #eraseMode": "setEraseMode",
    "click #selectMode": "setSelectMode",
    "mousedown svg" : "downHandler",
    "mousemove svg" : "moveHandler",
    "mouseup svg" : "upHandler"
  },

  executeIncomingAction: function(action) {
    var Model = window.models[action.type]
    var View = window.views[action.type];
    switch (action.method) {
    case "create":
      var view = new View({
        model: new Model(_.extend({
          id: action.id,
        }, JSON.parse(action.attrs)), {silent: true}),
        element: this.createElement(action.type)
      });
      break;
    case "update":
    case "patch":
      window.state.elements.get(action.id).set(JSON.parse(action.attrs));
      break;
    case "delete":
      window.state.elements.get(action.id).destroy({silent: true});
      break;
    }
    
  },

  initialize: function() {
    this.paper = new Raphael(this.el, $(window).width() - 25, $(window).height() - 100);

    this.currentStroke = null;

    window.modes = {
        ERASE: "erase",
        DRAW: "draw",
        SELECT: "select",
        TEXT: "text"
    };
    
    window.state = {
      elements: new ElementCollection,
      mode: window.modes.DRAW,
      mousedown: false,
      currentSelection: this.paper.set(),
      paper: this.paper,
      svgX: this.paper.canvas.offsetLeft,
      svgY: this.paper.canvas.offsetTop
    };

    
    if (Modernizr.touch) {
      utils.touchify(this.events);
      this.$el.on('touchstart', function(e) {
        e.preventDefault();
      });
    }
    _.bindAll(this);
    this.delegateEvents();

    window.socket.on('action', this.executeIncomingAction);
  },

  moveHandler: function(e) {
    switch (window.state.mode) {
    case window.modes.DRAW:
      if (this.currentStroke) {
        this.addPoint(e);
      } else if (window.state.mousedown) {
        this.startStroke(window.state.downEvent);
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

    window.state.mode = window.modes.SELECT;
  },

  startStroke: function(e) {
    var color = $("#color").val();
    var view = new StrokeView({
      element: this.createElement(window.modelTypes.STROKE),
      model: new Stroke(color ? {stroke: color} : {}),
    });
    view.model.save();
    this.currentStroke = view.model;
    this.addPoint(e);
  },

  upHandler: function(e) {
    window.state.mousedown = false;
    window.state.downEvent = null;
    switch (window.state.mode) {
    case window.modes.DRAW:
      if (this.currentStroke) {
        if (!Modernizr.touch) this.addPoint(e);
        this.currentStroke = null;
      }
      break;
    case window.modes.ERASE:

      break;
    }
  },

});

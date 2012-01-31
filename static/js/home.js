window.Space = Backbone.Model.extend({
  
});

window.SpaceList = Backbone.Collection.extend({
  model: Space,

  url: "/space"
});

window.spaces = new SpaceList;

window.SpaceView = Backbone.View.extend({
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  tagName: "li",

  template: _.template($("#space-template").html()),
});

window.SpaceListView = Backbone.View.extend({
  addOne: function(space) {
    var view = new SpaceView({model: space});
    this.el.append(view.render().el);
  },

  initialize: function() {
    this.setElement($("#space-list"));

    this.model.bind('change', this.render, this);
    this.model.bind('add', this.render, this);
  },

  render: function() {
    this.forEach(function(space) {
      space.
    })
  }
});


window.HomeView = Backbone.View.extend({
  createOnEnter: function(e) {
    if (e.keyCode != 13) return;
    this.createSpace();
  },

  createSpace: function() {
    var title = this.input.val();
    if (!title) return;
    window.spaces.create({
      title: title
    }, {
      success: function(data, textStatus, jqXHR) {
        console.log(textStatus);
        console.log(data);
      },

      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    this.input.val('');
  },

  events: {
    "click #create-space": "createSpace",
    "keypress #new-space": "createOnEnter",
  },

  initialize: function() {
    this.setElement("#spaces");
    this.input = this.$("#new-space");
  },
});

$(function() {
  window.homeView = new HomeView;
});

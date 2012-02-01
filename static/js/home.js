window.Space = Backbone.Model.extend({
  
});

window.SpaceList = Backbone.Collection.extend({
  model: Space,
});

window.spaces = new SpaceList;

window.SpaceView = Backbone.View.extend({
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return owner;
  },

  tagName: "li",

  template: _.template($("#space-template").html()),
});

window.SpaceListView = Backbone.View.extend({
  initialize: function() {
    this.setElement($("#space-list"));

    this.model.bind('change', this.render, )
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
    });
    this.input.val('');
  },

  events: {
    "click #create-space": "createSpace",
    "keypress #create-space": "createOnEnter",
  },

  initialize: function() {
    this.setElement("#spaces");
    this.input = this.$("#new-space");
  },
})

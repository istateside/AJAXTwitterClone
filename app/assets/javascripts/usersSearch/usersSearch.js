

  $.UsersSearch = function (el) {
    this.$el = $(el);
    this.$input = $($(el).find("input"));
    this.$ul = $(".users");
    this.bindListener();
  };

  $.UsersSearch.prototype.bindListener = function () {
    var self = this;
    this.$input.on('input', function (event) {
      $.ajax( {
        url: "/users/search",
        dataType: "json",
        data: { query: self.$input.val()},
        success: function (result) {
          self.renderResults(result);
        },
        error: function (result) {
          console.log(result);
        }
      });
    });
  };

  $.UsersSearch.prototype.renderResults = function (result) {
    var self = this;
    this.$ul.empty();
    console.log(result);
    result.forEach(function (el) {
      var $li = $('<li>')
      var $a = $('<a>').attr('href', '/users/' + el.id).html(el.username);
      var $followButton = $('<button>').addClass('follow-toggle')
      var followState = el.followed ? 'followed' : 'unfollowed'
      $followButton.followToggle({userId: el.id, followState: followState });
      $li.append($a, $followButton);
      self.$ul.append($li);
    });
  };

  $.fn.usersSearch = function () {
    this.each(function () {
      new $.UsersSearch(this);
    });
  };

  $(function () {
    $('div.users-search').usersSearch();
  })
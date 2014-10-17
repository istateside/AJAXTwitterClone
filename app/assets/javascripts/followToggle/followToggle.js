
  $.FollowToggle = function (el, options) {
    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = this.$el.data('initial-follow-state') || options.followState;
    this.render();
    this.handleClick();
  };

  $.FollowToggle.prototype.render = function () {
    var buttonText ;
    var disabled ;
    if (this.followState === "unfollowed") {
      buttonText = "Follow!";
      disabled = false;
    } else if (this.followState === "followed") {
      buttonText = "Unfollow!";
      disabled = false;

    } else if(this.followState === "following" ) {
      buttonText = "Following!";
      disabled = true;
    } else {
      buttonText = "Unfollowing!";
      disabled = true;
    }
    this.$el.html(buttonText);
    this.$el.prop("disabled", disabled);
  };

  $.FollowToggle.prototype.handleClick = function () {
    var self = this;

    this.$el.on('click', function (event) {
      event.preventDefault();
      if (self.followState === "unfollowed") {
        self.followState = "following";
        self.render();
        $.ajax( {
          type: "POST",
          url: "/users/" + self.userId + "/follow",
          dataType: "json",
          success: function () {
            self.followState = "followed";
            self.render();
          },
          error: function () {
            console.log("error!");
          }
        });
      } else if (self.followState === "followed") {
        self.followState = "unfollowing";
        self.render();
        $.ajax( {
          type: "DELETE",
          url: "/users/" + self.userId + "/follow",
          dataType: "json",
          success: function () {
            self.followState = "unfollowed";
            self.render();
          },
          error: function () {
            console.log("error!");
          }
        });
      }
    });
  };

  $.fn.followToggle = function (options) {
    return this.each(function () {
      new $.FollowToggle(this, options);

    });
  };


  $(function () {
    $("button.follow-toggle").followToggle();
  });

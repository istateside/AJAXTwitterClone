$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$letterCount = this.$el.find('strong');
  this.$feedUl = $(this.$el.data('tweets-ul'));
  this.$addMentionLink = $('.add-mentioned-user');
  this.$mentionedUsers = $('.mentioned-users');
  this.bindListeners();
}

$.TweetCompose.prototype.bindListeners = function () {
  var self = this;
  this.$el.on('submit', function (event) {
    event.preventDefault();
    self.submit();
  });

  this.$el.find('textarea').on('keyup', function(event) {
    var charsLeft = (event.currentTarget.value.length);
    self.$letterCount.html(charsLeft + '/140');
  });

  this.$addMentionLink.on('click', function(event) {
    self.addMentionedUser();
  });

  this.$mentionedUsers.on('click', "a.remove-mentioned-user", function (event) {
    var $link = $(event.currentTarget);
    $link.parent().remove()
  })
};

$.TweetCompose.prototype.addMentionedUser = function () {
  this.$mentionedUsers.append(this.$el.find('script').html());
};

$.TweetCompose.prototype.submit = function () {
  var formData = this.$el.serialize();
  this.$el.find(':input').prop('disabled', true);
  $.ajax({
    url: this.$el.attr('action'),
    data: formData,
    dataType: "json",
    type: "POST",
    success: this.handleSuccess.bind(this)
  });
};

$.TweetCompose.prototype.handleSuccess = function (result) {
  this.clearInput();
  this.$el.find(':input').prop('disabled', false);

  this.$feedUl.trigger('insert-tweet', result);
};

$.TweetCompose.prototype.clearInput = function () {
  this.$el.find('textarea').val("");
  this.$mentionedUsers.empty();
};

$.fn.tweetCompose = function () {
  this.each(function () {
    new $.TweetCompose(this);
  });
};

$(function() {
  $('.tweet-compose').tweetCompose();
});
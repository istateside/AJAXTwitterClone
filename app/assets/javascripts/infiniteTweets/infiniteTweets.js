$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.maxCreatedAt = null;
  this.insertTemplate = this.$el.find('script').html();
  this.bindListeners();
}

$.InfiniteTweets.prototype.bindListeners = function () {
  var self = this;
  this.$el.find('a.fetch-more').on('click', function(event) {
    event.preventDefault();
    self.fetchTweets();
  })

  this.$el.find("ul#feed").on('insert-tweet', function (event, tweet) {
    self.insertTweet([tweet]);
  });
};

$.InfiniteTweets.prototype.fetchTweets = function () {
  var ajaxObject = {
    url: '/feed',
    dataType: 'json',
    type: 'GET',
    success: this.insertTweets.bind(this),
    error: function() { console.log('it dun broke'); }
  };

  if (this.maxCreatedAt !== null) {
    ajaxObject.data = { max_created_at: this.maxCreatedAt };
  }
  $.ajax(ajaxObject);
};

$.InfiniteTweets.prototype.insertTweets = function (result) {
  var self = this;
  var tweets = _.template(self.insertTemplate)({ tweets: result });

  this.$el.find('ul#feed').append(tweets)

  var lastTweet = $(result).last();
  this.maxCreatedAt = lastTweet[0].created_at;

  if (result.length < 20) {
    this.$el.find('a.fetch-more').remove();
    this.$el.append('<strong>No More Tweets, Get A Life</strong>')
  }
};

$.InfiniteTweets.prototype.insertTweet = function (tweet) {
  var self = this;
  var tweets = _.template(self.insertTemplate)({ tweets: tweet });

  this.$el.find('ul#feed').prepend(tweets)
  if (this.maxCreatedAt === null ) {
   this.maxCreatedAt = tweet[0].created_at;
  }
};

$.fn.infiniteTweets = function () {
  this.each(function () {
    new $.InfiniteTweets(this);
  });
};

$(function() {
  $('.infinite-tweets').infiniteTweets();
});
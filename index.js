const axios = require('axios');
const cheerio = require('cheerio');

exports.getRatings = function(userId) {
  axios
    .get('http://www.imdb.com/user/' + userId + '/ratings')
    .then(res => {
      const films = [];

      var $ = cheerio.load(res.data); // Full HTML of the page
      const filteredData = $('#ratings-container').html();

      $ = cheerio.load(filteredData);

      $('.lister-item.mode-detail').each(function(i, elem) {
        films[i] = getFilmData($(this).html());
      });

      return films;
    })
    .catch(error => {
      console.log(error);
    });
};

function getFilmData(filmData) {
  const $ = cheerio.load(filmData);

  const imgSrc = $('.lister-item-image > a > .loadlate').attr('src');
  const title = $('.lister-item-content > .lister-item-header > a').html();
  const globalRatio = $('.ipl-rating-widget > .ipl-rating-star > .ipl-rating-star__rating').html();
  const userRatio = $(
    '.ipl-rating-widget > .ipl-rating-star--other-user > .ipl-rating-star__rating',
  ).html();

  const film = new Film(imgSrc, title, globalRatio, userRatio);

  return film;
}

class Film {
  constructor(imgSrc, title, globalRatio, userRatio) {
    this.imgSrc = imgSrc;
    this.title = title;
    this.globalRatio = globalRatio;
    this.userRatio = userRatio;
  }
}

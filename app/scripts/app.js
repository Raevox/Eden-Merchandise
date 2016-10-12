global.jQuery = require('jquery');
global.Tether = require('tether');
require('bootstrap');

const $ = global.jQuery;

$('.flip').click(event => {
  $(event.currentTarget).parents('.product').toggleClass('flipped');
});

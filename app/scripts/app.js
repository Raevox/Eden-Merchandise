global.jQuery = require('jquery');
global.Tether = require('tether');
require('bootstrap');

const $ = global.jQuery;

function toggleProductFlip(event) {
  $(event.currentTarget).parents('.product').toggleClass('flipped');
}

function toggleShoppingCart() {
  $('#shopping-cart').toggleClass('open');
}

$('.flip').click(toggleProductFlip);

$('#shopping-cart-toggle').click(toggleShoppingCart);

global.jQuery = require('jquery');
global.Tether = require('tether');
require('bootstrap');

const $ = global.jQuery;

const shoppingCart = {};

function toggleProductFlip(event) {
  $(event.currentTarget).parents('.product').toggleClass('flipped');
}

function toggleShoppingCart() {
  $('#shopping-cart').toggleClass('open');
}

function readShoppingCart() {
  const localCart = JSON.parse(localStorage.getItem('shoppingCart'));

  if (localCart && !$.isEmptyObject(localCart)) {
    localCart.forEach(product => {
      shoppingCart.push(product);
    });
  }

  return shoppingCart;
}

function writeShoppingCart() {
  if (!shoppingCart || !$.isEmptyObject(shoppingCart)) {
    localStorage.removeItem('shoppingCart');
    return '[]';
  }

  const shoppingCartJSON = JSON.stringify(shoppingCart);
  localStorage.setItem('shoppingCart', shoppingCartJSON);
  return shoppingCartJSON;
}

function init() {
  $('.flip').click(toggleProductFlip);
  $('#shopping-cart-toggle').click(toggleShoppingCart);

  readShoppingCart();
}

$(document).ready(init);

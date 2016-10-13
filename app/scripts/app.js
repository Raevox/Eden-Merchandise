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

function handleAddToCart(event) {
  const product = $(event.currentTarget).parents('.product');
  addToCart(product);
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

function buildProductObj(product) {
  const price = parseInt(
    product.find('.information > .price')
      .html()
      .substring(1)
  );

  const color = product.find('.color > span').css('backgroundColor');

  return {
    price,
    color,
    quantity: 1,
    timestamp: new Date()
  };
}

function addToCart(product) {
  const name = product.find('.information > .name').html();

  if (shoppingCart[name]) {
    shoppingCart[name].quantity++;
  } else {
    product.addClass('carted');
    shoppingCart[name] = buildProductObj(product);
  }

  return shoppingCart[name];
}

function removeFromCart(name) {
  const product = shoppingCart[name];

  if (product.quantity == 1) {
    delete shoppingCart[name];
    return 0;
  }

  product.quantity--;
  return product.quantity;
}

function init() {
  $('.flip').click(toggleProductFlip);
  $('#shopping-cart-toggle').click(toggleShoppingCart);
  $('.action > .fa-cart-plus').click(handleAddToCart);

  readShoppingCart();
}

$(document).ready(init);

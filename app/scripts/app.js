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
    for (let name in localCart) {
      $(`.product:contains(${name})`).addClass('carted');
      shoppingCart[name] = localCart[name];
    }

    updateShoppingCart();
  }

  return shoppingCart;
}

function writeShoppingCart() {
  if ($.isEmptyObject(shoppingCart)) {
    localStorage.removeItem('shoppingCart');
    return '{}';
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

  updateShoppingCart();
  writeShoppingCart();

  return shoppingCart[name];
}

function removeFromCart(name) {
  const product = shoppingCart[name];

  if (product.quantity == 1) {
    delete shoppingCart[name];
    updateShoppingCart();

    return 0;
  }

  product.quantity--;

  updateShoppingCart();
  writeShoppingCart();

  return product.quantity;
}

function updateShoppingCartItems(clear = false) {
  return;
}

function updateShoppingCartPrices(clear = false) {
  if (clear) {
    $('#subtotal, #tax, #total').html('0.00');
    return;
  }

  let subtotal = 0.00;

  for (let name in shoppingCart) {
    const product = shoppingCart[name];
    subtotal += product.price * product.quantity;
  }

  subtotal = Number(Math.round(subtotal + 'e2') + 'e-2');
  const tax = Number(Math.round(subtotal * 0.0625 + 'e2') + 'e-2');
  const total = Number(Math.round(subtotal + tax + 'e2') + 'e-2');

  $('#subtotal').html(subtotal);
  $('#tax').html(tax);
  $('#total').html(total);
}

function updateShoppingCart() {
  if ($.isEmptyObject(shoppingCart)) {
    updateShoppingCartItems(true);
    updateShoppingCartPrices(true);

    return;
  }

  updateShoppingCartItems();
  updateShoppingCartPrices();
}

function init() {
  $('.flip').click(toggleProductFlip);
  $('#shopping-cart-toggle').click(toggleShoppingCart);
  $('.fa-cart-plus').parent('.action').click(handleAddToCart);

  readShoppingCart();
}

$(document).ready(init);

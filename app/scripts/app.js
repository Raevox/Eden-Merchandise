global.jQuery = require('jquery');
global.moment = require('moment');
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

    $('#items').addClass('active');
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

  const size = product.find('.sizing > span').html();
  const color = product.find('.color > span').css('backgroundColor');

  return {
    price,
    size,
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

function removeFromCart(name, all = false) {
  const product = shoppingCart[name];

  if (all || product.quantity == 1) {
    delete shoppingCart[name];
    $(`.product:contains(${name})`).removeClass('carted');
  } else {
    product.quantity--;
  }

  updateShoppingCart();
  writeShoppingCart();

  return (product.quantity) ? product.quantity : 0;
}

function updateShoppingCartItems(clear = false) {
  const itemList = $('#items');

  if (clear) {
    itemList.html('');
    itemList.removeClass('active');

    return;
  }

  if (!itemList.hasClass('active')) itemList.addClass('active');

  let itemTotal = 0;
  let itemHTML = ``;

  for (let name in shoppingCart) {
    const product = shoppingCart[name];
    const quantityPrice = Number(Math.round(product.price * product.quantity + 'e2') + 'e-2');

    itemTotal += product.quantity;
    itemHTML += `
      <div class="item">
        <div class="name">${name} [ <span class="color" style="background-color: ${product.color}"></span> ]</div>
        <div class="date-added">Added ${moment(product.timestamp).fromNow()}</div>
        <div>${product.size}</div>
        <div>$${product.price}</div>
        <div>x${product.quantity} ($${quantityPrice})</div>
        <div class="remove" onclick="removeFromCart('${name}')">Remove<span class="fa fa-fw fa-cart-arrow-down"></span></div>
        <div class="remove" onclick="removeFromCart('${name}', true)">All<span class="fa fa-fw fa-times"></span></div>
      </div>
      <hr />`;
  }

  itemList.html(itemHTML);

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

  global.removeFromCart = removeFromCart;
}

$(document).ready(init);

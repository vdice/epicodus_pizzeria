// ********************************************
// Global 'Constants'
// ********************************************
var language = 'JP';

var CURRENCIES = {'JP': {name: 'yen', symbol: '¥', costSuffix: '00'},
                  'EN': {name: 'usd', symbol: '$', costSuffix: ' '}};

var TRANSLATIONS = {"mushroom": {EN: 'mushroom', JP: 'キノコ'},
                    "onion": {EN: 'onion', JP: 'タマネギ'},
                    "pepperoni": {EN: 'pepperoni', JP: 'ペパロニ'},
                    "tomato": {EN: 'tomato', JP: 'トマト'},
                    "sausage": {EN: 'sausage', JP: 'ソーセージ'},
                    "cheese": {EN: 'cheese', JP: 'チーズ'},
                    "broccoli": {EN: 'broccoli', JP: 'ブロッコリー'},
                    "chili-pepper": {EN: 'chili-pepper', JP: '唐辛子'},
                    "bell-pepper": {EN: 'bell-pepper', JP: 'ピーマン'},
                    "banana": {EN: 'banana', JP: 'バナナ'},
                    "name": {EN: 'Milk Baby Pizza', JP: 'ミルクの赤ちゃんのピザ'},
                    "greeting": {EN: 'Welcome', JP: 'ようこそ'},
                    "instruction": {EN: 'Please Order Below', JP: '以下にご注文ください'},
                    "size": {EN: 'Size', JP: 'サイズ'},
                    "toppings": {EN: 'Toppings', JP: 'トッピング'},
                    "count": {EN: 'Count', JP: 'カウント'},
                    "error": {EN: 'Please Specify a Size', JP: 'サイズをご指定ください'},
                    "order-header": {EN: 'Your Order', JP: 'ご注文'},
                    "including": {EN: 'including', JP: '含めて'},
                    "total": {EN: 'Total Cost', JP: '総費用'},
                    "title": {EN: 'Milk Baby Pizza', JP: 'ミルクの赤ちゃんのピザ'},
                    "symbol": {EN: CURRENCIES['EN'].symbol, JP: CURRENCIES['JP'].symbol}};

var toppings = [new Topping("mushroom", 1),
                new Topping("onion",    1),
                new Topping("pepperoni", 1.25),
                new Topping("tomato", 1.5),
                new Topping("sausage", 1),
                new Topping("cheese", 1),
                new Topping("broccoli", 1.5),
                new Topping("chili-pepper", 1.75),
                new Topping("bell-pepper", 1),
                new Topping("banana", 2)];

// ********************************************
// Topping
// ********************************************

function Topping(name, price) {
  this.name = name;
  this.price = price;
}

Topping.prototype.setPrice = function(price) {
  this.price = price;
}

// ********************************************
// Pizza
// ********************************************

function Pizza(size, cost) {
  this.size = size;
  this.cost = cost;
  this.toppings = [];
}

Pizza.prototype.addTopping = function(topping) {
  this.toppings.push(topping);
  this.cost += topping.price;
}

Pizza.prototype.getCost = function() {
  var cost = this.cost;
  toppings.forEach(function(topping) {
    cost += topping.price;
  });
  this.cost = cost;
  return this.cost;
}

// ********************************************
// Pizzeria
// ********************************************

function Pizzeria() {
  this.currency = CURRENCIES['JP'];
  this.sizes = ['7', '11', '15', '19', '23'];
  this.costs = this.calculateCosts(this.currency);
  this.pizzas = this.getPizzas();
  this.toppings = toppings;
}

Pizzeria.prototype.calculateCosts = function(currency) {
  var costs = {};

  var self = this;
  this.sizes.forEach(function(size) {
    costs[size] = Number(size + currency.costSuffix);
  });

  return costs;
}

Pizzeria.prototype.getPizzas = function() {
  var pizzas = [];

  var self = this;
  this.sizes.forEach(function(size) {
    pizzas.push(new Pizza(size, self.costs[size]));
  });

  return this.pizzas ? this.pizzas : pizzas;
}

Pizzeria.prototype.changeCurrency = function(language) {
  this.currency = CURRENCIES[language];
  this.costs = this.calculateCosts(this.currency);

  var self = this;
  this.toppings.forEach(function(topping) {
    console.log(topping)
    console.log(topping.price)
    if (language === 'EN') {
      topping.price = Number(String(topping.price).slice(0, topping.price.length-2));
    } else {
      topping.price = Number(String(topping.price).split('.').join('') + CURRENCIES[language].costSuffix);
    }
  });
  this.pizzas.forEach(function(pizza) {
    pizza.cost = pizza.getCost();
  });
}

Pizzeria.prototype.cost = function(size) {
  return this.costs[size];
}

Pizzeria.prototype.find = function(query) {
  var foundThing = null;

  if (isNaN(query)) { // query is a topping
    this.toppings.forEach(function(topping) {
      if (topping.name === query) {
        foundThing = topping;
      }
    });
  } else {            // query is a size
    this.pizzas.forEach(function(pizza) {
      if (pizza.size === query) {
        foundThing = pizza;
      }
    });
  }

  return foundThing;
}

// ********************************************
// DOM Logic
// ********************************************

$(function() {
  var pizzeria = new Pizzeria();
  $('#submit-button').html('<i class="fa fa-hand-o-right"></i>');

  // build sizes
  pizzeria.pizzas.forEach(function(pizza) {
    $('#pizza-sizes').append('<div class="col-xs-1">' +
                               '<span class="img-circle hoverable pizza-size">' +
                                 pizza.size + '"' +
                               '</span>' +
                             '</div>');
  });

  // build toppings
  pizzeria.toppings.forEach(function(topping) {
    $('#pizza-toppings').append('<div class="col-xs-1">' +
                                  '<span class="img-circle hoverable topping">' +
                                    '<img class="topping-image" src="img/' +
                                      topping.name + '.png">' +
                                  '</span>' +
                                '</div>');
  });

  switchTo(language);
  $('#language').click(function() {
    $(this).text($(this).val());
    language = ($(this).val() === 'EN') ? 'JP' : 'EN';
    $(this).val(language);
    pizzeria.changeCurrency(language);

    switchTo(language);
  });

  $('#pizza-form').submit(function(event) {
    event.preventDefault();
    resetFields();

    var size = $('#pizza-size').val().split('"')[0];
    var pizza = pizzeria.find(size);
    var toppings = $('.selected-topping');
    var count = Number($('#pizza-count').val());

    if (pizza) {
      thumbsUp($('#submit-button'));

      // add toppings
      toppings.each(function() {
        var topping = pizzeria.find(getToppingName($(this)));
        pizza.addTopping(topping);
      });

      // calculate cost
      var totalCost = count*pizza.getCost();

      $('#order-details').html('<small>(' + count + ') ' + pizza.size + '" ' +
                              '<img class="topping-image" src="img/pizza.png">');

      if (pizza.toppings.length > 0) {
        $('#toppings-listing').html('');
        pizza.toppings.forEach(function(topping) {
          // '<span class="translate" value="topping"></span>',' ',
          $('#toppings-listing').append('<img class="topping-image" src="img/' +
                                        topping.name + '.png">', '<br>');
        });
      }
      $('#total-cost').text(totalCost);

      $('#result').fadeIn();
    } else {
      $('#error').fadeIn();
      thumbsDown($('#submit-button'));
    }
  });

  $('.pizza-size').click(function() {
    pointRight($('#submit-button'));
    $('.selected').toggleClass('selected');
    $('#pizza-size').val($(this).text());
    $(this).toggleClass('selected');
  });

  $('.topping').click(function() {
    pointRight($('#submit-button'));
    $(this).toggleClass('selected-topping');
  });

  $('#pizza-count').focus(function() {
    pointRight($('#submit-button'));
  });

  function resetFields() {
    $('#error').hide();
    $('#result').hide();
    pizzeria = new Pizzeria();
  }
});

// ********************************************
// DOM Helpers
// ********************************************

var switchTo = function(language) {
  $('.translate').each(function() {
    $(this).text(TRANSLATIONS[$(this).attr('value')][language]);
  });

  var previousTotal = $('#total-cost').text();
  if (language === 'EN') {
    $('#total-cost').text([previousTotal.slice(0, previousTotal.length-2),
                          '.',
                          previousTotal.slice(previousTotal.length-2, -1)].join(''));
  } else {
    $('#total-cost').text(previousTotal.split('.').join(''));
  }
}

var getToppingName = function(element) {
  return element.find('img').attr('src').split('.')[0].split('/')[1];
}

var makeSuccess = function(element) {
  element.removeClass();
  element.addClass('btn btn-success');
}

var makeDanger = function(element) {
  element.removeClass();
  element.addClass('btn btn-danger');
}

var pointRight = function(element) {
  makeSuccess(element);
  element.find('i').removeClass();
  element.find('i').addClass('fa fa-hand-o-right');
}

var thumbsUp = function(element) {
  makeSuccess(element);
  element.find('i').removeClass();
  element.find('i').addClass('fa fa-thumbs-o-up');
}

var thumbsDown = function(element) {
  makeDanger(element);
  element.find('i').removeClass();
  element.find('i').addClass('fa fa-thumbs-o-down');
}

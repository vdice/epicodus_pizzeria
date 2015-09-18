// ********************************************
// Global 'Constants'
// ********************************************

var CURRENCIES = {'JPY': {name: 'yen', symbol: '¥', costSuffix: '00'},
                  'USD': {name: 'usd', symbol: '$', costSuffix: ' '}};

var TOPPINGS_JS_TRANSLATIONS = {"mushroom": 'キノコ',
                                "onion": 'タマネギ',
                                "pepperoni": 'ペパロニ',
                                "tomato": 'トマト',
                                "sausage": 'ソーセージ',
                                "cheese": 'チーズ',
                                "broccoli": 'ブロッコリー',
                                "chili-pepper": '唐辛子',
                                "bell-pepper": 'ピーマン',
                                "banana": 'バナナ'};

var TOPPINGS = [new Topping("mushroom", 100),
                new Topping("onion",    100),
                new Topping("pepperoni", 125),
                new Topping("tomato", 100),
                new Topping("sausage", 125),
                new Topping("cheese", 100),
                new Topping("broccoli", 150),
                new Topping("chili-pepper", 150),
                new Topping("bell-pepper", 100),
                new Topping("banana", 200)];

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

// ********************************************
// Pizzeria
// ********************************************

function Pizzeria() {
  this.currency = CURRENCIES['JPY'];
  this.sizes = ['7', '11', '15', '19', '23'];
  this.costs = this.calculateCosts(this.currency);
  this.pizzas = this.getPizzas();
  this.toppings = TOPPINGS;
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

Pizzeria.prototype.changeCurrency = function(currency) {
  this.costs = this.calculateCosts(currency);

  var self = this;
  this.pizzas.forEach(function(pizza) {
    pizza.cost = self.costs[pizza.size];
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

  $('#pizza-form').submit(function(event) {
    event.preventDefault();

    var size = $('#pizza-size').val().split('"')[0];
    var pizza = pizzeria.find(size);
    var toppings = $('.selected-topping');
    var count = Number($('#pizza-count').val());

    var resultHtml = '<h2>サイズをご指定ください!</h2>'; // Please specify a size!
    if (pizza) {
      thumbsUp($('#submit-button'));

      // add toppings
      toppings.each(function() {
        var topping = pizzeria.find(getToppingName($(this)));
        pizza.addTopping(topping);
      });

      // calculate cost
      var totalCost = pizzeria.currency.symbol + count*pizza.cost;

      // format result
      resultHtml = ['<h2>ご注文: <br>',
                    '<small>',
                    '(', count, ') ',
                    pizza.size + '" ',
                    '<img class="topping-image" src="img/pizza.png">'];

      if (pizza.toppings.length > 0) {
        resultHtml.push('<br>', '含めて: ', '<br>'); // including
        pizza.toppings.forEach(function(topping) {
          resultHtml.push(TOPPINGS_JS_TRANSLATIONS[topping.name], ' ',
                          '<img class="topping-image" src="img/' +
                          topping.name + '.png">', '<br>');
        });
      }
      resultHtml.push('</small>', '</h2>');
      resultHtml.push('<h2>総費用: <br>', totalCost, '</h2>');

      resultHtml.join('');
    } else {
      thumbsDown($('#submit-button'));
    }

    $('#result').html(resultHtml);
    $('#result').fadeIn();
    resetFields();
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
    pizzeria = new Pizzeria();
  }
});

// ********************************************
// DOM Helpers
// ********************************************

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

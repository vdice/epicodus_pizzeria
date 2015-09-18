var CURRENCIES = {'JPY': {name: 'yen', symbol: '¥', costSuffix: '00'},
                  'USD': {name: 'usd', symbol: '$', costSuffix: ' '}};

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
  this.toppings = [new Topping("mushroom", 100),
                   new Topping("onion",    100),
                   new Topping("pepperoni", 125),
                   new Topping("tomato", 100),
                   new Topping("sausage", 125),
                   new Topping("cheese", 100),
                   new Topping("broccoli", 150),
                   new Topping("chili-pepper", 150),
                   new Topping("bell-pepper", 100),
                   new Topping("banana", 200)];
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
  toggle($('#submit-button'));

  // build sizes
  pizzeria.pizzas.forEach(function(pizza) {
    $('#pizza-sizes').append('<div class="col-xs-1 mouseoverable">' +
                               '<span class="pizza-size selectable btn btn-success">' +
                                 pizza.size +
                               '</span>' +
                             '</div>');
  });

  // build toppings
  pizzeria.toppings.forEach(function(topping) {
    $('#pizza-toppings').append('<div class="col-xs-1 mouseoverable">' +
                                  '<span class="img-circle selectable topping">' +
                                    '<img src="img/' +
                                      topping.name + '.png" height="36px" width="36px">' +
                                  '</span>' +
                                '</div>');
  });

  $('#pizza-form').submit(function(event) {
    event.preventDefault();
    toggle($('#submit-button'));

    var size = $('#pizza-size').val();
    var pizza = pizzeria.find(size);
    var toppings = $('.selected-topping');
    toppings.each(function() {
      var topping = pizzeria.find(getToppingName($(this)));
      pizza.addTopping(topping);
    });

    var count = Number($('#pizza-count').val());

    var resultHtml = '<h2>サイズをご指定ください!</h2>'; // Please specify a size!
    if (pizza) {
      var totalCost = pizzeria.currency.symbol + pizza.cost;
      resultHtml = ['<h2>ご注文: <br>',
                    '<small>',
                    '(', count, ') ',
                    pizza.size + '" '];

      if (pizza.toppings.length > 0) {
        resultHtml.push('含めて: ', '<br>'); // including
        pizza.toppings.forEach(function(topping) {
          resultHtml.push(topping.name, '<br>');
        });
      }
      resultHtml.push('</small>', '</h2>');
      resultHtml.push('<h2>総費用: <br>', totalCost, '</h2>');

      resultHtml.join('');
    }

    $('#result').html(resultHtml);
    $('#result').fadeIn();
  });

  $('.mouseoverable').mouseover(function() {
    $('#submit-button').html('<i class="fa fa-hand-o-right"></i>');
  });

  $('.selectable').click(function() {
    $(this).toggleClass('btn-success');
  });

  $('.pizza-size').click(function() {
    $('#pizza-size').val($(this).text());
  });

  $('.topping').click(function() {
    $(this).toggleClass('selected-topping');
  });

  $('.focusable').focus(function() {
    toggle($('#submit-button'));
  });
});

// DOM Helper Functions

var getToppingName = function(element) {
  return element.find('img').attr('src').split('.')[0].split('/')[1];
}

var toggle = function(button) {
  if (button.find('i').attr('class') === 'fa fa-hand-o-right') {
    button.html('<i class="fa fa-thumbs-o-up"></i>');
  } else {
    button.html('<i class="fa fa-hand-o-right"></i>');
  }
}

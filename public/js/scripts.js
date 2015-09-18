var CURRENCIES = {'JPY': {name: 'yen', symbol: '¥', costSuffix: '00'},
                  'USD': {name: 'usd', symbol: '$', costSuffix: ' '}};

function Topping(name, price) {
  this.name = name;
  this.price = price;
}

Topping.prototype.setPrice = function(price) {
  this.price = price;
}

Topping.prototype.getPrice = function() {
  return this.price;
}

function Pizza(size, cost) {
  this.size = size;
  this.cost = cost;
  this.toppings = [];
}

Pizza.prototype.addToppings = function(toppingsArray) {
  var self = this;
  toppingsArray.forEach(function(topping) {
    self.toppings.push(topping);
  });
}

function Pizzeria() {
  this.currency = CURRENCIES['JPY'];
  this.sizes = ['7', '11', '15', '19', '23'];
  this.costs = this.calculateCosts(this.currency);
  this.pizzas = this.getPizzas();
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
  var pizzas = {};

  var self = this;
  this.sizes.forEach(function(size) {
    pizzas[size] = new Pizza(size, self.costs[size]);
  });

  return this.pizzas ? this.pizzas : pizzas;
}

Pizzeria.prototype.changeCurrency = function(currency) {
  this.costs = this.calculateCosts(currency);

  var self = this;
  for (var size in this.pizzas) {
    this.pizzas[size].cost = self.costs[size];
  }
}

Pizzeria.prototype.cost = function(size) {
  return this.costs[size];
}

// ********************************************
// Global 'Constants'
// ********************************************
// fx exchange settings for use with http://openexchangerates.github.io/money.js/
fx.rates = {
	"USD" : 0.008338,
	"JPY" : 1
};
fx.base = "JPY";

var CURRENCIES = {EN: 'USD', JP: 'JPY'};

var TRANSLATIONS = {"name": {EN: 'Milk Baby Pizza', JP: 'ミルクの赤ちゃんのピザ'},
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
                    "symbol": {EN: '$', JP: '¥'},
									  "lang": {EN: '日本語', JP: 'English'}}; // opposite

Number.prototype.toTwoDecimalPoints = function() {
	return Math.floor(this * 100) / 100;
}

// ********************************************
// Topping
// ********************************************

function Topping(name, price) {
  this.name = name;
  this.price = price;
}

// ********************************************
// Pizza
// ********************************************

function Pizza(size, cost) {
  this.size = size;
	this.basePrice = cost;
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

function Pizzeria(language) {
	this.language = language;
  this.currency = CURRENCIES[this.language];

  this.pizzas = [new Pizza('7',  fx(700).from(fx.base).to(this.currency)),
								 new Pizza('11', fx(1100).from(fx.base).to(this.currency)),
							 	 new Pizza('15', fx(1500).from(fx.base).to(this.currency)),
							 	 new Pizza('19', fx(1900).from(fx.base).to(this.currency)),
							 	 new Pizza('23', fx(2300).from(fx.base).to(this.currency))];

	this.toppings = [new Topping("mushroom",     fx(100).from(fx.base).to(this.currency)),
 	                 new Topping("onion",        fx(100).from(fx.base).to(this.currency)),
 									 new Topping("olive",        fx(100).from(fx.base).to(this.currency)),
 	                 new Topping("tomato",       fx(100).from(fx.base).to(this.currency)),
									 new Topping("bell-pepper",  fx(100).from(fx.base).to(this.currency)),
 	                 new Topping("broccoli",     fx(125).from(fx.base).to(this.currency)),
									 new Topping("pepperoni",    fx(150).from(fx.base).to(this.currency)),
 	                 new Topping("sausage",      fx(150).from(fx.base).to(this.currency)),
 	                 new Topping("chili-pepper", fx(150).from(fx.base).to(this.currency)),
									 new Topping("anchovy",      fx(175).from(fx.base).to(this.currency)),
									 new Topping("eggplant",     fx(175).from(fx.base).to(this.currency)),
 	                 new Topping("banana",       fx(200).from(fx.base).to(this.currency))];
}

Pizzeria.prototype.adjustCosts = function(currency) {
	var self = this;
	this.toppings.forEach(function(topping) {
		topping.price = fx(topping.price).from(self.currency).to(currency);
	});

	this.pizzas.forEach(function(pizza) {
		pizza.basePrice = fx(pizza.basePrice).from(self.currency).to(currency);
		pizza.cost = fx(pizza.cost).from(self.currency).to(currency);
	});
}

Pizzeria.prototype.changeCurrency = function(language) {
  var newCurrency = CURRENCIES[language];
  this.adjustCosts(newCurrency);
  this.currency = newCurrency;
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
	var language = $("#language").val();
  var pizzeria = new Pizzeria(language);
	var size, count, pizza, toppings;
  $('#submit-button').html('<i class="fa fa-hand-o-right"></i>');

  // build sizes
  pizzeria.pizzas.forEach(function(pizza) {
    $('#pizza-sizes').append('<div class="col-xs-1">' +
															'<h4>' +
                               '<span class="img-circle hoverable pizza-size point-right">' +
                                 pizza.size + '"<br>' +
																 '<i><small id="pizza-' + pizza.size + '-cost">' + pizza.cost + '</small></i>' +
                               '</span>' +
															'</h4>' +
                             '</div>');
  });

  // build toppings
  pizzeria.toppings.forEach(function(topping) {
    $('#pizza-toppings').append('<div class="col-xs-1">' +
                                  '<span class="img-circle hoverable topping point-right">' +
                                    '<img class="topping-image" src="img/' +
                                      topping.name + '.png">' +
																			'<i><small id="topping-' + topping.name + '-cost">' + topping.price + '</small></i>' +
                                  '</span>' +
                                '</div>');
  });

	var switchTo = function(language) {
		// translate all relevant elements using chosen language
		$('.translate').each(function() {
			$(this).text(TRANSLATIONS[$(this).attr('value')][language]);
		});
		// update prices in chosen currency
		pizzeria.pizzas.forEach(function(pizza) {
			$('#pizza-' + pizza.size + '-cost').text(pizza.basePrice.toTwoDecimalPoints());
		})
		pizzeria.toppings.forEach(function(topping) {
			$('#topping-' + topping.name + '-cost').text(topping.price.toTwoDecimalPoints());
		})
		$('#total-cost').text(getCost(count, pizza))
	}

	switchTo(language);
  $('#language').click(function() {
		language = ($(this).val() === 'EN') ? 'JP' : 'EN';
    $(this).text(TRANSLATIONS["lang"][language]); // toggle button text
    $(this).val(language); // set current language mode via value
    pizzeria.changeCurrency(language);
    switchTo(language);
  });

  $('#pizza-form').submit(function(event) {
    event.preventDefault();
    resetFields();

    pizzeria = new Pizzeria(language);
    size = $('#pizza-size').val().split('"')[0];
    pizza = pizzeria.find(size);
    toppings = $('.selected-topping');
    count = Number($('#pizza-count').val());

    if (pizza) {
      thumbsUp($('#submit-button'));

      // add toppings
      toppings.each(function() {
        var topping = pizzeria.find(getToppingName($(this)));
        pizza.addTopping(topping);
      });

      // calculate cost
      var totalCost = getCost(count, pizza);

      $('#order-details').html('<small>(' + count + ') ' + pizza.size + '" ' +
                              '<img class="topping-image" src="img/pizza.png">');

      if (pizza.toppings.length > 0) {
        $('#toppings-listing').html('');
        pizza.toppings.forEach(function(topping) {
          $('#toppings-listing').append('<img class="topping-image" src="img/' +
                                        topping.name + '.png">');
        });
				$('#toppings-listings').show();
      }
      $('#total-cost').text(totalCost);

      $('#result').fadeIn();
    } else {
      $('#error').fadeIn();
      thumbsDown($('#submit-button'));
    }
  });

	$('.point-right').click(function() {
		pointRight($('#submit-button'));
	})

  $('.pizza-size').click(function() {
    $('.selected-size').toggleClass('selected-size'); // un-select any other selected
		$('.selected').toggleClass('selected');
    $('#pizza-size').val($(this).text());
    $(this).find('small').toggleClass('selected-size');
		$(this).toggleClass('selected');
  });

  $('.topping').click(function() {
    $(this).find('small').toggleClass('selected-choice');
		$(this).toggleClass('selected-topping selected')
  });

  function resetFields() {
    $('.hideable').hide();
  }
});

// ********************************************
// DOM Helpers
// ********************************************

var getCost = function(count, pizza) {
	return !count || !pizza ? 0 : (count*pizza.cost).toTwoDecimalPoints();
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

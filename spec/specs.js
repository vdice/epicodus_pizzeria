describe('Topping', function() {
  var testTopping;

  beforeEach(function() {
    testTopping = new Topping('calamari', 100);
  });

  it('returns its name', function() {
    expect(testTopping.name).to.equal('calamari');
  });

  it('returns its price', function() {
    expect(testTopping.price).to.equal(100);
  });

  it('returns its altered price', function() {
    testTopping.price = 200;
    expect(testTopping.price).to.equal(200);
  });
});

describe('Pizza', function() {
  var testPizza, testToppings;

  beforeEach(function() {
    testPizza = new Pizza('7', 700);
    testToppings = [new Topping('calamari', 100),
                    new Topping('natto', 200)];
  });

  it('returns its base price with no toppings', function() {
    expect(testPizza.cost).to.equal(700);
  });

  it('can recieve additional toppings', function() {
    expect(testPizza.toppings).to.eql([]);
    testToppings.forEach(function(topping) {
      testPizza.addTopping(topping);
    });
    expect(testPizza.toppings).to.eql(testToppings);
  });

  it('returns its price including toppings', function() {
    testToppings.forEach(function(topping) {
      testPizza.addTopping(topping);
    });
    expect(testPizza.cost).to.equal(1000);
  });
});

describe('Pizzeria', function() {
  var testPizzeria;

  beforeEach(function() {
    testPizzeria = new Pizzeria('JP');
  });

  it('returns base pizzas', function() {
    expect(testPizzeria.pizzas.length).to.equal(5);
  });

  it('returns available toppings', function() {
    expect(testPizzeria.toppings.length).to.equal(10);
  });

  it('finds a pizza by size', function() {
    expect(testPizzeria.find('7')).to.eql(new Pizza('7', 700));
  });

  it('finds a topping by name', function() {
    expect(testPizzeria.find('pepperoni')).to.eql(new Topping('pepperoni', 150));
  });

  it('returns cost of a pizza', function() {
    expect(testPizzeria.find('7').cost).to.equal(700);
  });

  it('returns currency-appropriate costs', function() {
    expect(testPizzeria.pizzas[0].cost).to.equal(700);
    testPizzeria.changeCurrency('EN');
    expect(testPizzeria.pizzas[0].cost).to.equal(fx(700).from('JPY').to('USD'));
  });
});

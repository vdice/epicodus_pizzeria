describe('Topping', function() {
  var testTopping;

  beforeEach(function() {
    testTopping = new Topping('calamari', 100);
  });

  it('returns its name', function() {
    expect(testTopping.name).to.equal('calamari');
  });

  it('returns its price', function() {
    expect(testTopping.getPrice()).to.equal(100);
  });

  it('returns its altered price', function() {
    testTopping.setPrice(200);
    expect(testTopping.getPrice()).to.equal(200);
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
    testPizza.addToppings(testToppings);
    expect(testPizza.toppings).to.eql(testToppings);
  });

  it('returns its price including toppings', function() {
    testPizza.addToppings(testToppings);
    expect(testPizza.cost).to.equal(1000);
  });
});

describe('Pizzeria', function() {
  var testPizzeria;

  beforeEach(function() {
    testPizzeria = new Pizzeria();
  });

  it('returns base pizzas', function() {
    expect(testPizzeria.getPizzas()['7']).to.eql(new Pizza('7', 700));
  });

  it('returns cost of a pizza', function() {
    expect(testPizzeria.cost('7')).to.equal(700);
  });

  it('returns currency-appropriate costs', function() {
    expect(testPizzeria.pizzas['7'].cost).to.equal(700);
    testPizzeria.changeCurrency(CURRENCIES['USD']);
    expect(testPizzeria.pizzas['7'].cost).to.equal(7);
  });
})

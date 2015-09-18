describe('Topping', function() {
  var testTopping = new Topping('calamari', 100);

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
  var testPizza = new Pizza('7', 700);

  it('returns its base price with no toppings', function() {
    expect(testPizza.cost).to.equal(700);
  });
});

describe('Pizzeria', function() {
  var testPizzeria = new Pizzeria();

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

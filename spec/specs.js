describe('Topping', function() {
  var testTopping = new Topping('calamari');

  it('returns its name', function() {
    expect(testTopping.name).to.equal('calamari');
  });

  it('returns its price', function() {
    testTopping.setPrice(100);
    expect(testTopping.getPrice()).to.equal(100);
  });
});

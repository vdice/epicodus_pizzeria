describe('Topping', function() {
  it('returns its name', function() {
    var testTopping = new Topping('calamari');
    expect(testTopping.name).to.equal('calamari');
  });
});

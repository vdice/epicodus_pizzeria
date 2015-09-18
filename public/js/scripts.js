function Topping(name) {
  this.name = name;
  this.price = 0;
}

Topping.prototype.setPrice = function(price) {
  this.price = price;
}

Topping.prototype.getPrice = function() {
  return this.price;
}

function f(a, b, c) {
  if (a < b && b < c) {
    console.log('awesome');
  }
  else if (a < b || b < c) {
    console.log('fantastic');
  }
  else {
    console.log('groovy');
  }
}

f(2, 1, 3);

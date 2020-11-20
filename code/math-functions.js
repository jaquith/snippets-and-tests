function add (a, b) {
  return a + b
}

function subtract (a, b) {
  return a - b
}

let testString = 'You found me!'

// appease the linter by using everything
add(1, 2)
subtract(1, 2)
const otherString = testString
testString = otherString

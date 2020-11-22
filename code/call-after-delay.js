// used to test our setTimeout and stubbing/spying/mocking
function callAfterDelay (fn) {
  window.setTimeout(fn, 2000)
}
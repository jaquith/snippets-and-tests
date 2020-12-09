// used to test our setTimeout and stubbing/spying/mocking capabilities
function callAfterDelay (fn) {
  window.setTimeout(fn, 2000)
}
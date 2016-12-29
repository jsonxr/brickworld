
function empty() {}
const logger = console;
logger.namespace = function(ns) {
  function wrap(fn) {
    fn()
  }

  return {
    info: wrap(console.info),
    warn: wrap(console.warn),
    trace: wrap(console.trace),
    error: wrap(console.error)
  };
};

export default logger;

function ignore() {}

const debug = console;

function namespace(ns) {
  let DEBUG;
  if (typeof(window) !== 'undefined') {                                  // Browser
    DEBUG = window.DEBUG;
  } else {
    DEBUG = process.env.DEBUG;
  }

  if (!DEBUG) return ignore;
  if (DEBUG.split(' ').indexOf(ns) < 0) return ignore;
  return debug.log;
}

export default namespace;

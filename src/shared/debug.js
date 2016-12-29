function ignore() {}


function namespace(ns) {
  let DEBUG;
  if (global.process && global.process.env) {
    DEBUG = global.process.env.DEBUG;
  } else {
    DEBUG = global.DEBUG;
  }

  if (!DEBUG) return ignore;
  if (DEBUG.split(' ').indexOf(ns) < 0) return ignore;
  return console.log;
}

export default namespace;

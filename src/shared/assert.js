/**
 *
 * @param fn
 * @returns {boolean}
 */
function assert(fn) {
  fn();
  return true;
}

assert.isOk = (value) => {
  if (value === undefined || value === null) {
    throw new Error('Expected value to be ok, value is ${value}');
  }
};

assert.isNotOk = (value) => {
  if (value !== undefined && value !== null) {
    throw new Error('Expected value to not be ok, value is ${value}');
  }
};

assert.isAbove = (actual, expected) => {
  if (actual <= expected) {
    throw new Error(`Value should be above ${expected}, actual value was ${actual}`);
  }
};

assert.isAtLeast = (actual, expected) => {
  if (actual < expected) {
    throw new Error(`Value should be at least ${expected}, actual value was ${actual}`);
  }
};

assert.isBelow = (actual, expected) => {
  if (actual >= expected) {
    throw new Error(`Value should be below ${expected}, actual value was ${actual}`);
  }
};

assert.isAtMost = (actual, expected) => {
  if (actual > expected) {
    throw new Error(`Value should be at most ${expected}, actual value was ${actual}`);
  }
};

assert.isTrue = (value) => {
  if (value !== true) {
    throw new Error(`Value should be true, actual value was ${value}`);
  }
};

assert.isNotTrue = (value) => {
  if (value === true) {
    throw new Error(`Value should not be true, actual value was ${value}`);
  }
};

assert.isFalse = (value) => {
  if (value !== false) {
    throw new Error(`Value should be false, actual value was ${value}`);
  }
};

assert.isNotFalse = (value) => {
  if (value === false) {
    throw new Error(`Value should not be false, actual value was ${value}`);
  }
};

assert.isNull = (value) => {
  if (value !== null) {
    throw new Error('value is not null.');
  }
};

assert.isNotNull = (value) => {
  if (value === null) {
    throw new Error('value is null.');
  }
};

assert.isNan = (value) => {
  throw new Error(`Not implemented yet, value was ${value}.`);
};

assert.isNotNan = (value) => {
  throw new Error(`Not implemented yet, value was ${value}.`);
};

assert.isUndefined = (value) => {
  if (value !== undefined) {
    throw new Error('value is defined.');
  }
};

assert.isDefined = (value) => {
  if (value === undefined) {
    throw new Error('value is undefined.');
  }
};

assert.isFunction = (value) => {
  throw new Error(`Not implemented yet, value was ${value}.`);
};

assert.isNotFunction = (value) => {
  throw new Error(`Not implemented yet, value was ${value}.`);
};

assert.isObject = (value) => {
  throw new Error(`Not implemented yet, value was ${value}.`);
};

assert.isNotObject = (value) => {
  throw new Error(`Not implemented yet, value was ${value}.`);
};

assert.isArray = (value) => {
  if (!Array.isArray(value)) {
    console.error('Expected value to be an array', value);
    throw new Error('Expected value to be an array');
  }
};

assert.isNotArray = (value) => {
  if (Array.isArray(value)) {
    console.error('Expected value to not be an array', value);
    throw new Error('Expected value to not be an array.');
  }
};

assert.isString = (value) => {
  if (typeof value !== 'string') {
    throw new Error(`Expected value to be a string, value '${value}' was of type ${typeof value}`);
  }
};

assert.isNotString = (value) => {
  if (typeof value === 'string') {
    throw new Error(`Expected value to not be a string, value was '${value}'`);
  }
};

assert.isNumber = (value) => {
  if (typeof value !== 'number') {
    throw new Error(`Expected value to be a number, value ${value} was of type ${typeof value}`);
  }
};

assert.isNotNumber = (value) => {
  if (typeof value === 'number') {
    throw new Error(`Expected value to not be a number, value was ${value}`);
  }
};

assert.isBoolean = (value) => {
  if (typeof value !== 'boolean') {
    throw new Error(`Expected value to be a boolean, value ${value} was of type ${typeof value}`);
  }
};

assert.isNotBoolean = (value) => {
  if (typeof value === 'boolean') {
    throw new Error(`Expected value to not be a boolean, value was ${value}`);
  }
};

assert.instanceOf = (object, constructor) => {
  if (! (object instanceof constructor)) {
    throw new Error(`Expected object to be instanceof ${constructor}`);
  }
};

assert.notInstanceOf = (object, constructor) => {
  if (object instanceof constructor) {
    throw new Error(`Expected object to NOT be instanceof ${constructor}`);
  }
};

/**
 *
 * Use this when performance is critical and you still want to assert
 * calling parameters. This will wrap the underlying function and call
 * this function before
 *
 *     assert.wrap(HeroControl.prototype, 'update',
 *       // Pre
 *       function (delta) {
 *         console.log('pre');
 *       },
 *       // Post
 *       function (delta) {
 *         console.log('post');
 *       }
 *     );
 *
 * @param prototype { object } Prototype to modify
 * @param name { string } Name of the function to attach pre/post functions
 * @param fnPre { function } callback function (args)
 * @param fnPost { function } callback function(result, args)
 */
assert.wrap = function (prototype, name, fnPre, fnPost) {
  const fn = prototype[name];
  prototype[name] = function() {
    fnPre && fnPre.call(this, arguments); // Only call if defined
    const result = fn.apply(this, arguments);
    fnPost && fnPost.call(this, result, arguments); // Only call if defined
    return result;
  };
};

let exportedAssert = assert;

// If Assert is not defined, then we need to just return an empty object
const ASSERT = (typeof(window) !== 'undefined')
  ? window.ASSERT
  : process.env.ASSERT;
if (ASSERT !== 'true' && ASSERT !== true) {
  const keys = Object.keys(assert);
  exportedAssert = function() {};
  keys.forEach((key) => {
    exportedAssert[key] = function () {};
  });
}

export {
  exportedAssert as default
};

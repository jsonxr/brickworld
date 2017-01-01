function assert(fn) {
  fn();
  return true;
}

assert.isOk = (value) => {
  if (value === undefined || value === null) {
    throw new Error('value is not defined.');
  }
};

assert.isDefined = (value) => {
  if (value === undefined) {
    throw new Error('value is undefined.');
  }
};

assert.isUndefined = (value) => {
  if (value !== undefined) {
    throw new Error('value is defined.');
  }
};

assert.isArray = (value) => {
  if (!Array.isArray(value)) {
    throw new Error('value is not an array.');
  }
};

assert.isNotNull = (value) => {
  if (value === null) {
    throw new Error('value is null.');
  }
};

assert.isNull = (value) => {
  if (value !== null) {
    throw new Error('value is not null.');
  }
};
export {
  assert as default
};

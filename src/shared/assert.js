function assert(fn) {
  fn();
}

assert.isDefined = (value) => {
  if (value === undefined || value === null) {
    throw new Error('value is not defined.');
  }
};

export {
  assert as default
};

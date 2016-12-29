import uuid from './uuid';

function generateId() {
  return uuid.v4slug();
}

/**
 * Sets default options for objects
 * @param obj The object on which to set values
 * @param options Dictionary of values to set on the object
 * @param ignore Keys to ignore on the values dictionary. Important if you want to handle the option specifically
 */
function setOptions(obj, options, ignore = []) {
  if (options === undefined) return;
  if (typeof options !== 'object') throw new Error(`Think you are calling utils.setOptions wrong... values: ${options}`);
  for (let key of Object.keys(options)) {
    if (ignore && ignore.indexOf(key) >= 0) {
      continue;
    }
    const newValue = options[key];
    if (newValue === undefined) {
      console.warn(`Brick: '${key}' parameter is undefined.`);
      continue;
    }
    // Check that it exists on this object
    const currentValue = obj[key];
    if (currentValue === undefined) {
      console.warn(`Brick: '${key}' is not a property.`);
      continue;
    }
    obj[key] = newValue;
  }
}

// To make obj fully immutable, freeze each object in obj.
// To do so, we use this function.
function deepFreeze(obj) {

  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach(function(name) {
    const prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
}


export {
  deepFreeze,
  generateId,
  setOptions
};

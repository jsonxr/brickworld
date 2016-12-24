
function setOptions(obj, values, ignore = []) {
  if ( values === undefined ) return;
  for (let key of Object.keys(values)) {
    if (ignore && ignore.indexOf(key) >= 0) {
      console.warn(`Brick: ignoring key '${key}'.`);
      continue;
    }
    const newValue = values[key];
    if (newValue === undefined) {
      console.warn(`Brick: '${key}' parameter is undefined.`);
      continue;
    }
    // Check that it exists on this object
    const currentValue = obj[key];
    if (currentValue === undefined) {
      console.log(values);
      console.warn(`Brick: '${key}' is not a property.`);
      continue;
    }
    obj[key] = newValue;
  }
}

export {
  setOptions
};

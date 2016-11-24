postMessage("I\'m working before postMessage(\'ali\').");

onmessage = function (event) {
  postMessage("Hi " + event.data.value);
};
function log(level, msg, obj) {
  if (level >= log.LEVEL) {
    if (level === log.LEVEL_ERROR) {
      console.error(msg);
    } else {
      console.log(msg);
    }
  }
}
log.trace = function (msg, obj) {
  log(log.LEVEL_TRACE, msg, obj);
};
log.debug = function (msg, obj) {
  log(log.LEVEL_DEBUG, msg, obj);
};
log.info = function (msg, obj) {
  log(log.LEVEL_INFO, msg, obj);
};
log.warning = function(msg, obj) {
  log(log.LEVEL_WARNING, msg, obj);
};
log.error = function(msg, obj) {
  log(log.LEVEL_ERROR, msg, obj);
};

// LOG LEVELS
log.LEVEL_TRACE = 10;
log.LEVEL_DEBUG = 20;
log.LEVEL_INFO = 30;
log.LEVEL_WARNING = 40;
log.LEVEL_ERROR = 50;
// Current Log level
log.LEVEL = log.LEVEL_INFO;


export default log;

class Clock {

  constructor(autoStart) {
    let me = this;
    me.autoStart = (autoStart !== undefined) ? autoStart : true;
    me.startTime = 0;
    me.stopTime = 0;
    me.elapsedTime = 0;
    me.running = false;
  }

  start() {
    let me = this;
    me.startTime = self.performance.now();
    me.oldTime = me.startTime;
    me.running = true;
  }

  stop() {
    let me = this;
    me.getDelta();
    me.running = false;
  }

  getDelta() {
    let me = this;
    let diff = 0;
    if (me.autoStart && !me.running) {
      me.start();
    }
    if (me.running) {
      let newTime = self.performance.now();
      diff = 0.001 * (newTime - me.oldTime);
      me.oldTime = newTime;
      me.elapsedTime += diff;
    }
    return diff;
  }

  getElapsedTime() {
    let me = this;
    me.getDelta();
    return me.elapsedTime;
  }

}

export default Clock;

class Profiler {

  constructor() {
    this.start = self.performance.now();
    this.last = this.start;
    this.elapsed = 0;
  }

  mark() {
    const now = self.performance.now();
    const diff = now - this.last;
    this.last = now;
    return diff;
  }

  elapsed() {
    const now = self.performance.now();
    return now - start;
  }

  reset() {
    this.startTime = self.performance.now();
    this.stopTime = this.startTime;
    this.elapsedTime = 0;
  }

}

export default Profiler;

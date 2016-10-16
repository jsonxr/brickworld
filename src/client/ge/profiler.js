/**
 *
 * @memberOf client/ge
 */
class Profiler {

  /**
   *
   */
  constructor() {
    this.start = performance.now();
    this.last = this.start;
    this.elapsed = 0;
  }

  /**
   *
   * @returns {number}
   */
  mark() {
    const now = performance.now();
    const diff = now - this.last;
    this.last = now;
    return diff;
  }

  /**
   *
   * @returns {number}
   */
  elapsed() {
    const now = performance.now();
    return now - this.start;
  }

  /**
   *
   */
  reset() {
    this.startTime = performance.now();
    this.stopTime = this.startTime;
    this.elapsedTime = 0;
  }

}

export default Profiler;

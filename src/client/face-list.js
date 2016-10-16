
/**
 *
 */
class Node {
  /**
   *
   * @param {number} left The lowest value of the range
   * @param {number} right The highest value of the range
   * @param {*} data The object that is attached to the node
   */
  constructor(left, right, data) {
    this.left = left;
    this.right = right;
    this.data = data;
  }
}

/**
 *
 * This is an in-order list of faces that all map to a single object. A
 * box has 6 faces and all of them map to an object. When finding a face index
 * It does a binary search on the ordered array.
 */
class FaceList {
  /**
   */
  constructor() {
    this.values = [];
  }

  /**
   * Pushes object to the end of the array. In order for find to work, these
   * have to be pushed in order. If they aren't pushed in order, then it
   * will fail.
   * @param {number} left The left number
   * @param {number} right The right numbrer
   * @param {*} obj
   */
  push(left, right, obj) {
    this.values.push(new Node(left, right, obj));
  }

  /**
   * The number of entries in the list
   * @returns {Number}
   */
  get length() {
    return this.values.length;
  }
  /**
   * Returns item if index is between left/right.
   * @param {number} index The index that will be found
   */
  find(index) {
    let min = 0;
    let max = this.values.length - 1;
    let guessIndex;
    let guess;

    while (min <= max) {
      // index = Math.floor((min + max) / 2);  // max <= 2147483647
      guessIndex = (min + max) >> 1;
      guess = this.values[guessIndex];

      if (guess.right < index) {
        min = guessIndex + 1;
      } else if (guess.left > index) {
        max = guessIndex - 1;
      } else {
        return guess;
      }
    }

    return null;
  }
}

export {
  FaceList as default,
};

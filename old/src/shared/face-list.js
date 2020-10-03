/**
 *
 */
class Node {
  /**
   *
   * @param {number} left The lowest value of the range
   * @param {number} right The highest value of the range
   * @param {*} value The object that is attached to the node
   */
  constructor(left, right, value) {
    this.left = left;
    this.right = right;
    this.value = value;
  }

  toString() {
    return `Node{left: ${this.left}, right: ${this.right}, value: ${JSON.stringify(this.value)}`;
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
    this._nodes = [];
  }

  /**
   * Pushes object to the end of the array. In order for find to work, these
   * have to be pushed in order. If they aren't pushed in order, then it
   * will fail. Push will not validate that there are overlapping left/right
   * values.
   * @param {number} left The left number of the node
   * @param {number} right The right number of the node
   * @param {*} obj
   */
  push(left, right, obj) {
    this._nodes.push(new Node(left, right, obj));
  }

  /**
   * Validates that all the nodes are increasing order and have no overlaps.
   * Returns true if all is well
   */
  isValid() {
    let old = null;
    let valid = true;
    for (const node of this._nodes) {
      if (old) {
        if (node.left <= old.right) {
          valid = false;
          break;
        }
        old = node;
      }
    }
    return valid;
  }

  /**
   * The number of entries in the list
   * @returns {Number}
   */
  get length() {
    return this._nodes.length;
  }

  /**
   *
   * @param index Entry to retrieve
   * @returns {*} Entry at index
   */
  get nodes() {
    return this._nodes;
  }

  /**
   * Returns item if index is between left/right values of node.
   * @param {number} index The index that will be found
   */
  find(index) {
    let min = 0;
    let max = this._nodes.length - 1;
    let guessIndex;
    let guessNode;

    // Search by dividing values in half
    while (min <= max) {
      // guessIndex = Math.floor((min + max) / 2);  // max <= 2147483647
      guessIndex = (min + max) >> 1; // <-- Fast way of doing the above
      guessNode = this._nodes[guessIndex];
      if (guessNode.right < index) {
        min = guessIndex + 1;
      } else if (guessNode.left > index) {
        max = guessIndex - 1;
      } else {
        return guessNode;
      }
    }
    return null;
  }
}

export default FaceList;

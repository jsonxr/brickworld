'use strict';

import PartTemplate from './part-template';



class PartStud extends PartTemplate {
  constructor(part, options = {}) {
    super(part, options);
  }

  //------------------------------------
  // Properties
  //------------------------------------

  get part() {
    return this.parent;
  }

}

export default PartStud;

'use strict';

import Dexie from 'dexie';

class Storage {
  constructor() {
    this._db = new Dexie('My World');
    // Schema
    this._db.version(1).stores({
      // chunks collection only index the name
      chunks: '&name'
    });
    this._db.open(); // Don't need to catch since operations are queued and those will fail also if open fails.
  }

  save(name, json) {
    json.name = name;
    const str = JSON.stringify(json);
    console.log(`saving... ${name}: ${str}`);
    return this._db.chunks.put(json);
  }

  load(name) {
    console.log(`loading chunk ${name}`);
    return this._db.chunks.get(name);
  }
}

export default Storage;


import fs from 'fs';
import path from 'path';
import parts from '../shared/parts';

function toGroups(array, count) {
  let str = '';
  let newArray = [];
  for (let i = 0; i < array.length; i=i+(count*3)) {
    let offset = 0;
    let row = [];
    // x,y,z
    for (let j = 0; j < count*3; j++) {
      const index = i+offset;
      row.push(array[index]);
      offset++;
    }
    newArray.push(row);
  }
  str = newArray.join(',\n      ');
  return str;
}

function toPrettyJson(part) {
  const json = part.toJSON();
  const str = `{
  "id": "${part.id}",
  "type": "${part.type}",
  "name": "${part.name}",
  "geometry": {
    "positions": [
      ${toGroups(json.positions, 3)}
    ],
    "normals": [
      ${toGroups(json.normals, 3)}
    ],
    "uvs": [
      ${toGroups(json.uvs, 2)}
    ]
  },
  "studs": {
  }
}
`;
  //console.log(json.normals);
  return str;
  //return JSON.stringify(part.toJSON(), null, 2);
}

function handler(argv) {
  console.log(argv);
  if (argv.part === 'all') {
    //console.log(`exporting ${argv.part}`);
    Object.keys(parts).forEach((key) => {
      const part = parts[key];
      const filename = path.join(argv.out, `${part.id}.json`);
      const str = toPrettyJson(part);
      fs.writeFileSync(filename, str);
    });
  }
}

module.exports = {
  command: 'export <part>',
  describe: 'Exports a part into json format.',
  builder: {
    out: {
      default: '.models'
    }
  },
  handler: handler
};

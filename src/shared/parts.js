import Part from './part';
import Stud from './stud';
import {
  OUTLINE_SCALE,
  getGeometryForBrickPart,
  getStudPositionsForBrickPart
} from './brick-geometry';


const json = {
  // 1x bricks
  '3005' : { type:'brick', name: 'Brick 1x1',   width: 1,  depth: 1,  height: 3  },
  '3004' : { type:'brick', name: 'Brick 1x2',   width: 1,  depth: 2,  height: 3  },
  '3622' : { type:'brick', name: 'Brick 1x3',   width: 1,  depth: 3,  height: 3  },
  '3010' : { type:'brick', name: 'Brick 1x4',   width: 1,  depth: 4,  height: 3  },
  '3009' : { type:'brick', name: 'Brick 1x6',   width: 1,  depth: 6,  height: 3  },
  '3008' : { type:'brick', name: 'Brick 1x8',   width: 1,  depth: 8,  height: 3  },
  '6111' : { type:'brick', name: 'Brick 1x10',  width: 1,  depth: 10, height: 3  },
  '6112' : { type:'brick', name: 'Brick 1x12',  width: 1,  depth: 12, height: 3  },
  '2465' : { type:'brick', name: 'Brick 1x16',  width: 1,  depth: 16, height: 3  },
  '3003' : { type:'brick', name: 'Brick 2x2',   width: 2,  depth: 2,  height: 3  },
  '3002' : { type:'brick', name: 'Brick 2x3',   width: 2,  depth: 3,  height: 3  },
  '3001' : { type:'brick', name: 'Brick 2x4',   width: 2,  depth: 4,  height: 3  },
  '2456' : { type:'brick', name: 'Brick 2x6',   width: 2,  depth: 6,  height: 3  },
  '3007' : { type:'brick', name: 'Brick 2x8',   width: 2,  depth: 8,  height: 3  },
  '3006' : { type:'brick', name: 'Brick 2x10',  width: 2,  depth: 10, height: 3  },
  '2356' : { type:'brick', name: 'Brick 4x6',   width: 4,  depth: 6,  height: 3  },
  '6212' : { type:'brick', name: 'Brick 4x10',  width: 4,  depth: 10, height: 3  },
  '4202' : { type:'brick', name: 'Brick 4x12',  width: 4,  depth: 12, height: 3  },
  '30400': { type:'brick', name: 'Brick 4x18',  width: 4,  depth: 18, height: 3  },
  '4201' : { type:'brick', name: 'Brick 8x8',   width: 8,  depth: 8,  height: 3  },
  '4204' : { type:'brick', name: 'Brick 8x16',  width: 8,  depth: 16, height: 3  },
  '30072': { type:'brick', name: 'Brick 12x24', width: 12, depth: 24, height: 3  },
  '14716': { type:'brick', name: 'Brick 1x1x3', width: 1,  depth: 1,  height: 9  },
  '2453' : { type:'brick', name: 'Brick 1x1x5', width: 1,  depth: 1,  height: 15 },
  '30144': { type:'brick', name: 'Brick 2x4x3', width: 2,  depth: 4,  height: 9  },
  '722'  : { type:'brick', name: 'Brick 1x2x2', width: 1,  depth: 2,  height: 6  },
  '2454' : { type:'brick', name: 'Brick 1x2x5', width: 1,  depth: 2,  height: 15 },
  '3755' : { type:'brick', name: 'Brick 1x3x5', width: 1,  depth: 3,  height: 15 },
  '3754' : { type:'brick', name: 'Brick 1x6x5', width: 1,  depth: 6,  height: 15 },
  '30145': { type:'brick', name: 'Brick 2x2x3', width: 2,  depth: 2,  height: 9  },
  '3024' : { type:'plate', name: 'Plate 1x1',   width: 1,  depth: 1,  height: 1  },
  '3023' : { type:'plate', name: 'Plate 1x2',   width: 1,  depth: 2,  height: 1  },
  '3623' : { type:'plate', name: 'Plate 1x3',   width: 1,  depth: 3,  height: 1  },
  '3710' : { type:'plate', name: 'Plate 1x4',   width: 1,  depth: 4,  height: 1  },
  '3666' : { type:'plate', name: 'Plate 1x6',   width: 1,  depth: 6,  height: 1  },
  '3460' : { type:'plate', name: 'Plate 1x8',   width: 1,  depth: 8,  height: 1  },
  '4477' : { type:'plate', name: 'Plate 1x10',  width: 1,  depth: 10, height: 1  },
  '60479': { type:'plate', name: 'Plate 1x12',  width: 1,  depth: 10, height: 1  },
  '3022' : { type:'plate', name: 'Plate 2x2',   width: 2,  depth: 2,  height: 1  },
  '3021' : { type:'plate', name: 'Plate 2x3',   width: 2,  depth: 3,  height: 1  },
  '3020' : { type:'plate', name: 'Plate 2x4',   width: 2,  depth: 4,  height: 1  },
  '3795' : { type:'plate', name: 'Plate 2x6',   width: 2,  depth: 6,  height: 1  },
  '3034' : { type:'plate', name: 'Plate 2x8',   width: 2,  depth: 8,  height: 1  },
  '3832' : { type:'plate', name: 'Plate 2x10',  width: 2,  depth: 10, height: 1  },
  '2445' : { type:'plate', name: 'Plate 2x12',  width: 2,  depth: 12, height: 1  },
  '91988': { type:'plate', name: 'Plate 2x14',  width: 2,  depth: 14, height: 1  },
  '4282' : { type:'plate', name: 'Plate 2x16',  width: 2,  depth: 16, height: 1  },
  '11212': { type:'plate', name: 'Plate 3x3',   width: 3,  depth: 3,  height: 1  },
  '3031' : { type:'plate', name: 'Plate 4x4',   width: 4,  depth: 4,  height: 1  },
  '3032' : { type:'plate', name: 'Plate 4x6',   width: 4,  depth: 6,  height: 1  },
  '3035' : { type:'plate', name: 'Plate 4x8',   width: 4,  depth: 8,  height: 1  },
  '3030' : { type:'plate', name: 'Plate 4x10',  width: 4,  depth: 10, height: 1  },
  '3029' : { type:'plate', name: 'Plate 4x12',  width: 4,  depth: 12, height: 1  },
  '3958' : { type:'plate', name: 'Plate 6x6',   width: 6,  depth: 6,  height: 1  },
  '3036' : { type:'plate', name: 'Plate 6x8',   width: 6,  depth: 8,  height: 1  },
  '3033' : { type:'plate', name: 'Plate 6x10',  width: 6,  depth: 10, height: 1  },
  '3028' : { type:'plate', name: 'Plate 6x12',  width: 6,  depth: 12, height: 1  },
  '3456' : { type:'plate', name: 'Plate 6x14',  width: 6,  depth: 14, height: 1  },
  '3027' : { type:'plate', name: 'Plate 6x16',  width: 6,  depth: 16, height: 1  },
  '3026' : { type:'plate', name: 'Plate 6x24',  width: 6,  depth: 24, height: 1  },
  '41539': { type:'plate', name: 'Plate 8x8',   width: 8,  depth: 8,  height: 1  },
  '728'  : { type:'plate', name: 'Plate 8x11',  width: 8,  depth: 11, height: 1  },
  '92438': { type:'plate', name: 'Plate 8x16',  width: 8,  depth: 16, height: 1  },
  '91405': { type:'plate', name: 'Plate 16x16', width: 16, depth: 16, height: 1  },
  '3811': { type: 'baseplate', name: 'Baseplate 32x32', width: 32, depth: 32, height: 3/8 }
};

class Parts {
  constructor() {
    this._parts = {};
    Object.keys(json).forEach( (key) => {
      const obj = json[key];
      const part = new Part({ id: key, type: obj.type, name: obj.name});
      // Push the brick and studs
      part.pushGeometryLod(getGeometryForBrickPart(obj.width, obj.depth, obj.height, 'none'));

      const studs = [];
      const positions = getStudPositionsForBrickPart(obj.width, obj.depth, obj.height);
      positions.forEach( (position) => {
        studs.push(new Stud(part, { position: position }));
      });
      part.studs = studs;
      // Outline
      part.outline = getGeometryForBrickPart(obj.width, obj.depth, obj.height, 'none');
      part.outline.scale(OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE);
      // Selection
      this._parts[key] = part;
    });
  }

  add(id, part) {
    this._parts[id] = part;
  }

  getById(id) {
    const part = this._parts[id];
    if (!part) {
      throw new Error(`Part '${id}' not found`);
    }
    return part;
  }
}

const parts = new Parts();

export default parts;

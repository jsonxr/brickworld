import BrickTemplate from './brick-template';

const Bricks = {};
Bricks['3001'] = new BrickTemplate({ name: 'Brick 2x4', width: 2, depth: 4, height: 3 });
Bricks['3002'] = new BrickTemplate({ name: 'Brick 2x3', width: 2, depth: 3, height: 3 });

export {
  Bricks as default,
};

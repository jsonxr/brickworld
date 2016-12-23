import { assert } from 'chai';
import colors from '../../src/shared/colors';

describe('shared/colors', () => {

  it('should allow access by color name', () => {
    assert(colors['WHITE'], 'WHITE not defined');
    assert(colors['BRIGHT_RED'], 'BRIGHT_RED not defined');
    assert(colors['BRIGHT_BLUE'], 'BRIGHT_BLUE not defined');
    assert(colors['BRIGHT_YELLOW'], 'BRIGHT_YELLOW not defined');
    assert(colors['BLACK'], 'BLACK not defined');
    assert(colors['DARK_GREEN'], 'DARK_GREEN not defined');
    assert(colors['BRIGHT_GREEN'], 'BRIGHT_GREEN not defined');
    assert(colors['MEDIUM_BLUE'], 'MEDIUM_BLUE not defined');
    assert(colors['BRIGHT_ORANGE'], 'BRIGHT_ORANGE not defined');
    assert(colors['BRIGHT_YELLOWISH_GREEN'], 'BRIGHT_YELLOWISH_GREEN not defined');
    assert(colors['BRIGHT_REDDISH_VIOLET'], 'BRIGHT_REDDISH_VIOLET not defined');
    assert(colors['SAND_BLUE'], 'SAND_BLUE not defined');
    assert(colors['EARTH_BLUE'], 'EARTH_BLUE not defined');
    assert(colors['EARTH_GREEN'], 'EARTH_GREEN not defined');
    assert(colors['SAND_GREEN'], 'SAND_GREEN not defined');
    assert(colors['DARK_RED'], 'DARK_RED not defined');
    assert(colors['FLAME_YELLOWISH_ORANGE'], 'FLAME_YELLOWISH_ORANGE not defined');
    assert(colors['REDDISH_BROWN'], 'REDDISH_BROWN not defined');
    assert(colors['LIGHT_ROYAL_BLUE'], 'LIGHT_ROYAL_BLUE not defined');
    assert(colors['BRIGHT_PURPLE'], 'BRIGHT_PURPLE not defined');
    assert(colors['LIGHT_PURPLE'], 'LIGHT_PURPLE not defined');
    assert(colors['COOL_YELLOW'], 'COOL_YELLOW not defined');
    assert(colors['MEDIUM_LILAC'], 'MEDIUM_LILAC not defined');
    assert(colors['DARK_BROWN'], 'DARK_BROWN not defined');
    assert(colors['DARK_AZUR'], 'DARK_AZUR not defined');
    assert(colors['MEDIUM_AZUR'], 'MEDIUM_AZUR not defined');
    assert(colors['MEDIUM_LAVENDER'], 'MEDIUM_LAVENDER not defined');
    assert(colors['LAVENDER'], 'LAVENDER not defined');
    assert(colors['OLIVE_GREEN'], 'OLIVE_GREEN not defined');
    assert(colors['BLACK'], 'BLACK not defined');
    assert(colors['BRIGHT_RED'], 'BRIGHT_RED not defined');
  });

  it('should allow access by color number', () => {
    assert(colors[1]);
    assert(colors[21]);
    assert(colors[23]);
    assert(colors[24]);
    assert(colors[26]);
    assert(colors[28]);
    assert(colors[37]);
    assert(colors[102]);
    assert(colors[106]);
    assert(colors[119]);
    assert(colors[124]);
    assert(colors[135]);
    assert(colors[140]);
    assert(colors[141]);
    assert(colors[151]);
    assert(colors[154]);
    assert(colors[191]);
    assert(colors[192]);
    assert(colors[212]);
    assert(colors[221]);
    assert(colors[222]);
    assert(colors[226]);
    assert(colors[268]);
    assert(colors[308]);
    assert(colors[321]);
    assert(colors[322]);
    assert(colors[324]);
    assert(colors[325]);
    assert(colors[330]);
  });

  it('should provide underlying color object data', () => {
    assert(colors.array);
    assert(colors.array.length > 0);
  });

  it('should provide array of color strings', () => {
    assert(colors.values);
    assert(colors.values.length > 0);
  });
});

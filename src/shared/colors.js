import { Color } from 'three';

const array =[
  { 'id': '1', 'name': 'White', 'value': '#FFFFFF', edge: '#333333' },
  { 'id': '21', 'name': 'Bright Red', 'value': '#C91A09', edge: '#333333' },
  { 'id': '23', 'name': 'Bright Blue', 'value': '#0055BF', edge: '#333333' },
  { 'id': '24', 'name': 'Bright Yellow', 'value': '#F2CD37', edge: '#333333' },
  { 'id': '26', 'name': 'Black', 'value': '#05131D', edge: '#595959' },
  { 'id': '28', 'name': 'Dark Green', 'value': '#257A3E', edge: '#333333' },
  { 'id': '37', 'name': 'Bright Green', 'value': '#4B9F4A', edge: '#333333' },
  { 'id': '102', 'name': 'Medium Blue', 'value': '#5C9DD1', edge: '#333333' },
  { 'id': '106', 'name': 'Bright Orange', 'value': '#FE8A18', edge: '#333333' },
  { 'id': '119', 'name': 'Bright Yellowish Green', 'value': '#BBE90B', edge: '#333333' },
  { 'id': '124', 'name': 'Bright Reddish Violet', 'value': '#923978', edge: '#333333' },
  { 'id': '135', 'name': 'Sand Blue', 'value': '#597184', edge: '#333333' },
  { 'id': '136', 'name': 'Sand Violet', 'value': '#845E84', edge: '#333333' },
  { 'id': '138', 'name': 'Sand Yellow', 'value': '#958A73', edge: '#333333' },
  { 'id': '140', 'name': 'Earth Blue', 'value': '#0D325B', edge: '#1E1E1E' },
  { 'id': '141', 'name': 'Earth Green', 'value': '#184632', edge: '#595959' },
  { 'id': '151', 'name': 'Sand Green', 'value': '#A0BCAC', edge: '#333333' },
  { 'id': '153', 'name': 'Sand Red', 'value': '#D67572', edge: '#333333' },
  { 'id': '154', 'name': 'Dark Red', 'value': '#720E0F', edge: '#333333' },
  { 'id': '191', 'name': 'Flame Yellowish Orange', 'value': '#F8BB3D', edge: '#333333' },
  { 'id': '192', 'name': 'Reddish Brown', 'value': '#582A12', edge: '#595959' },
  { 'id': '194', 'name': 'Medium Stone Grey', 'value': '#A0A5A9', edge: '#333333' },
  { 'id': '199', 'name': 'Dark Stone Grey', 'value': '#6C6E68', edge: '#333333' },
  { 'id': '208', 'name': 'Light Stone Grey', 'value': '#E6E3E0', edge: '#333333' },
  { 'id': '212', 'name': 'Light Royal Blue', 'value': '#86C1E1', edge: '#333333' },
  { 'id': '221', 'name': 'Bright Purple', 'value': '#C870A0', edge: '#333333' },
  { 'id': '222', 'name': 'Light Purple', 'value': '#E4ADC8', edge: '#333333' },
  { 'id': '226', 'name': 'Cool Yellow', 'value': '#FFF03A', edge: '#333333' },
  { 'id': '268', 'name': 'Medium Lilac', 'value': '#3F3691', edge: '#1E1E1E' },
  { 'id': '308', 'name': 'Dark Brown', 'value': '#352100', edge: '#595959' },
  { 'id': '321', 'name': 'Dark Azur', 'value': '#1498D7', edge: '#333333' },
  { 'id': '322', 'name': 'Medium Azur', 'value': '#3EC2DD', edge: '#333333' },
  { 'id': '324', 'name': 'Medium Lavender', 'value': '#AC78BA', edge: '#333333' },
  { 'id': '325', 'name': 'Lavender', 'value': '#E1D5ED', edge: '#333333' },
  { 'id': '330', 'name': 'Olive Green', 'value': '#9B9A5A', edge: '#333333' }
];

const colors = {
  array: array,
  values: []
};
const threeColors = {};

// Iterate over all the json objects to build our numbers and names
for (const c of array) {
  colors[c.id] = c;
  colors.values.push(c.value);
  if (!threeColors[c.value]) {
    threeColors[c.value] = new Color(c.value);
  }
  if (!threeColors[c.edge]) {
    threeColors[c.edge] = new Color(c.edge);
  }
}

colors.getById = (id) => {
  const color = colors[id];
  if (!color) {
    throw new Error(`Color not found ${id}`);
  }
  return color;
};



export {
  colors as default,
  colors,
  threeColors,
};

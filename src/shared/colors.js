const array =[
  { 'id': '1', 'name': 'WHITE', 'value': '#FFFFFF' },
  { 'id': '21', 'name': 'BRIGHT_RED', 'value': '#C91A09' },
  { 'id': '23', 'name': 'BRIGHT_BLUE', 'value': '#0055BF' },
  { 'id': '24', 'name': 'BRIGHT_YELLOW', 'value': '#F2CD37' },
  { 'id': '26', 'name': 'BLACK', 'value': '#05131D' },
  { 'id': '28', 'name': 'DARK_GREEN', 'value': '#257A3E' },
  { 'id': '37', 'name': 'BRIGHT_GREEN', 'value': '#4B9F4A' },
  { 'id': '102', 'name': 'MEDIUM_BLUE', 'value': '#5C9DD1' },
  { 'id': '106', 'name': 'BRIGHT_ORANGE', 'value': '#FE8A18' },
  { 'id': '119', 'name': 'BRIGHT_YELLOWISH_GREEN', 'value': '#BBE90B' },
  { 'id': '124', 'name': 'BRIGHT_REDDISH_VIOLET', 'value': '#923978' },
  { 'id': '135', 'name': 'SAND_BLUE', 'value': '#597184' },
  { 'id': '140', 'name': 'EARTH_BLUE', 'value': '#0D325B' },
  { 'id': '141', 'name': 'EARTH_GREEN', 'value': '#184632' },
  { 'id': '151', 'name': 'SAND_GREEN', 'value': '#A0BCAC' },
  { 'id': '154', 'name': 'DARK_RED', 'value': '#720E0F' },
  { 'id': '191', 'name': 'FLAME_YELLOWISH_ORANGE', 'value': '#F8BB3D' },
  { 'id': '192', 'name': 'REDDISH_BROWN', 'value': '#582A12' },
  { 'id': '212', 'name': 'LIGHT_ROYAL_BLUE', 'value': '#86C1E1' },
  { 'id': '221', 'name': 'BRIGHT_PURPLE', 'value': '#C870A0' },
  { 'id': '222', 'name': 'LIGHT_PURPLE', 'value': '#E4ADC8' },
  { 'id': '226', 'name': 'COOL_YELLOW', 'value': '#FFF03A' },
  { 'id': '268', 'name': 'MEDIUM_LILAC', 'value': '#3F3691' },
  { 'id': '308', 'name': 'DARK_BROWN', 'value': '#352100' },
  { 'id': '321', 'name': 'DARK_AZUR', 'value': '#1498D7' },
  { 'id': '322', 'name': 'MEDIUM_AZUR', 'value': '#3EC2DD' },
  { 'id': '324', 'name': 'MEDIUM_LAVENDER', 'value': '#AC78BA' },
  { 'id': '325', 'name': 'LAVENDER', 'value': '#E1D5ED' },
  { 'id': '330', 'name': 'OLIVE_GREEN', 'value': '#9B9A5A' }
];

const colors = {
  array: array,
  values: []
};

// Iterate over all the json objects to build our numbers and names
for (const c of array) {
  colors[c.id] = c.value;
  colors[c.name] = c.value;
  colors.values.push(c.value);
}

export default colors;

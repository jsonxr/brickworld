const json = `
{
  "name": "kate",
  "version": 1,
  "bricks": [
    {
      "part": "3001",
      "color": "#FF0000",
      "position": [
        0,
        0,
        0
      ]
    },
    
    {
      "part": "3005",
      "color": "#FF0000",
      "position": [
        30,
        0,
        10
      ]
    }
  ]
}
`;

export default JSON.parse(json);

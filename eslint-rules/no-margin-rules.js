const marginProperties = [
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'marginStart',
  'marginEnd',
];

const message = 'Use gap or padding to decide children component spacing. Sub components should not intervene the parent component layout.';

module.exports = marginProperties.map(property => ({
  selector: `Property[key.name="${property}"]`,
  message,
}));
const core = require('./core.js');

const _number = core.createType(config => {
  const { required = false, min, max } = config;

  const def = {
    type: 'number',
    required: core.stringify(required),
    min,
    max,
  };

  const construct = value => Number(value);

  const validate = (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
    if (isRequired && (core.isUndefined(value) || value === '')) return core.error('propertype-required');
    if (core.isUndefined(value)) return;
    if (typeof value === 'object') return core.error('propertype-type');
    if (typeof value === 'function') return core.error('propertype-type');
    if (Number.isNaN(+value)) return core.error('propertype-type');
    if (min && value < min) return core.error('propertype-number-min');
    if (max && value > max) return core.error('propertype-number-max');
  }

  const output = construct;
  output.construct = construct;
  output.def = def;
  output.validate = validate;

  return output;
});

module.exports = _number;

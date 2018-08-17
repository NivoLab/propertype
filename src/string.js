const core = require('./core.js');

const _string = core.createType(config => {
  const { required = false, min, max, pattern = '.*' } = config;

  const def = {
    type: 'string',
    required: core.stringify(required),
    min,
    max,
    pattern,
  };

  const construct = value => String(value);

  const validate = (value, props) => {
    const isRequired = (typeof required === 'function') ? required(props) : required;
    if (isRequired && (core.isUndefined(value) || value === '')) return core.error('propertype-required');
    if (core.isUndefined(value) || value === '') return;
    if (typeof value !== 'string') return core.error('propertype-type');
    if (min && value.length < min) return core.error('propertype-string-min');
    if (max && value.length > max) return core.error('propertype-string-max');
    if (core.testPattern(pattern, value) !== true) return core.error('propertype-string-pattern');
  };

  const output = construct;
  output.construct = construct;
  output.def = def;
  output.validate = validate;

  return output;
});

module.exports = _string;

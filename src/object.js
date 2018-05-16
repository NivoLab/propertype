const core = require('./core.js');

module.exports = (config = {}) => {
  const { required = false } = config;

  const def = {
    type: 'object',
    required: core.stringify(required),
  };

  const construct = value => ({ ...value });

  const validate = (value, props) => {
    const isRequired = (typeof required === 'function') ? required(props) : required;
    if (isRequired && core.isUndefined(value)) return core.error('propertype-required');
    if (core.isUndefined(value)) return;
    if (typeof value !== 'object') return core.error('propertype-type');
    if (Array.isArray(value)) return core.error('propertype-type');
  };

  const output = construct;
  output.construct = construct;
  output.def = def;
  output.validate = validate;

  return output;
};

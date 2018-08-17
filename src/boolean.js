const core = require('./core.js');

const _boolean = core.createType(config => {
  const { required = false } = config;

  const def = {
    type: 'boolean',
    required: core.stringify(required),
  };

  const construct = value => value.toString().toLowerCase() === 'true';

  const validate = (value, props) => {
    const isRequired = (typeof required === 'function') ? required(props) : required;
    if (isRequired && core.isUndefined(value)) return core.error('propertype-required');
    if (core.isUndefined(value)) return;
    if (!['true', 'false'].includes(value.toString())) return core.error('propertype-type');
  };

  const output = construct;
  output.construct = construct;
  output.def = def;
  output.validate = validate;

  return output;
});

module.exports = _boolean;

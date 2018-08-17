const core = require('./core.js');

const _any = core.createType(config => {
  const { required = false } = config;

  const def = {
    type: 'any',
    required: core.stringify(required),
  };
  const construct = value => value;
  const validate = (value, props) => {
    const isRequired = (typeof required === 'function') ? required(props) : required;
    if (isRequired && core.isUndefined(value)) return core.error('propertype-required');
  };

  const output = construct;
  output.construct = construct;
  output.def = def;
  output.validate = validate;

  return output;
});

module.exports = _any;

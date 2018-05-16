const core = require('./core.js');

module.exports = (config = {}) => {
  const { required = false, minLength, maxLength, type: _type = any() } = config;

  const type = ('validate' in _type) ? _type : _type();

  const def = {
    type: 'arrayOf',
    required: core.stringify(required),
    type: type.def,
  };

  const construct = list => list.map(item => type.construct(item));

  const validate = (value, props) => {
    const isRequired = (typeof required === 'function') ? required(props) : required;
    if (isRequired && core.isUndefined(value)) return core.error('propertype-missing');
    if (core.isUndefined(value)) return;
    if (minLength && value.length < minLength) return core.error('propertype-array-min');
    if (maxLength && value.length > maxLength) return core.error('propertype-array-max');
    if (!Array.isArray(value)) return core.error('propertype-type');
    const results = value.map(item => type.validate(item));
    if (results.find(item => item !== undefined)) return results;
  };

  const output = construct;
  output.construct = construct;
  output.def = def;
  output.validate = validate;

  return output;
}
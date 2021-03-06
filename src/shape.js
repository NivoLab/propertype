const core = require('./core.js');

function ValidationError(info) {
  this.code = 400;
  this.name = 'ValidationError';
  this.message = 'There are one or more errors in pre-construct validation';
  this.info = info;
  this.toString = function () {
    return `${this.name}: ${this.message};${JSON.stringify(this.info)}`;
  };
}

const _shape = core.createType(config => {
  const { required = false, types: _types = {} } = config;

  const types = Object.keys(_types).reduce((acc, propId) => ({
    ...acc,
    [propId]: ('validate' in _types[propId]) ? _types[propId] : _types[propId](),
  }), {});

  const def = {
    type: 'shape',
    required: core.stringify(required),
    types: core.explain(types),
  };

  const construct = value => Object.keys(types).reduce((obj, propId) => ({
    ...obj,
    [propId]: types[propId].construct(value[propId]),
  }), {});

  const validate = (value, props) => {
    const isRequired = (typeof required === 'function') ? required(props) : required;
    if (isRequired && core.isUndefined(value)) return core.error('propertype-required');
    if (core.isUndefined(value)) return;
    if (typeof value !== 'object') return core.error('propertype-type');
    const result = core.validate(types, value);
    if (Object.keys(result).length > 0) return result;
  };

  const output = props => {
    const errors = validate(props);
    if (errors) throw new ValidationError(errors);
    return construct(props);
  }

  output.construct = construct;
  output.def = def;
  output.validate = validate;
  output.explain = () => core.explain(types);

  return output;
});

module.exports = _shape;

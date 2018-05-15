/* eslint-disable no-confusing-arrow */
const error = type => type;
const isUndefined = value => (typeof value === 'undefined');
const testPattern = (pattern, input) => new RegExp(pattern).test(input);
const stringify = value => {
  if (typeof value === 'function') return `(${value.toString()})`;
  return value.toString();
}

const checkTypes = (types, props) => {
  const propResults = Object.keys(types)
    .reduce((propResults, propId) => {
      const rule = types[propId];
      const value = props[propId];
      const ruleResult = rule.func(value, props);
      if (!ruleResult) return propResults;

      return { ...propResults, [propId]: ruleResult };
    }, {});

  return propResults;
};

module.exports.checkTypes = checkTypes;

const showTypes = types => {
  return Object.keys(types)
    .filter(propId => types[propId].def.type !== 'hidden')
    .reduce((propResults, propId) => {
      const rule = types[propId];
      return {
        ...propResults,
        [propId]: {
          ...rule.def,
          funcString: stringify(rule.func),
        },
      };
    }, {});
};

module.exports.showTypes = showTypes;

const any = (config = {}) => {
  const { required = false } = config;

  return {
    def: {
      type: 'any',
      required: stringify(required),
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && isUndefined(value)) return error('propertype-missing');
    },
    construct: value => value,
  }
};

module.exports.any = any;

const boolean = (config = {}) => {
  const { required = false } = config;

  return {
    def: {
      type: 'boolean',
      required: stringify(required),
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && isUndefined(value)) return error('propertype-missing');
      if (isUndefined(value)) return;
      if (!['true', 'false'].includes(value.toString())) return error('propertype-type');
    },
    construct: value => value.toString().toLowerCase() === 'true',
  };
};

module.exports.boolean = boolean;

const string = (config = {}) => {
  const { required = false, minLength, maxLength, pattern = '.*' } = config;

  return {
    def: {
      type: 'string',
      required: stringify(required),
      minLength,
      maxLength,
      pattern,
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && (isUndefined(value) || value === '')) return error('propertype-missing');
      if (isUndefined(value) || value === '') return;
      if (typeof value !== 'string') return error('propertype-type');
      if (minLength && value.length < minLength) return error('propertype-string-min');
      if (maxLength && value.length > maxLength) return error('propertype-string-max');
      if (testPattern(pattern, value) !== true) return error('propertype-pattern');
    },
    construct: value => String(value),
  };
};

module.exports.string = string;

const number = (config = {}) => {
  const { required = false, minValue, maxValue } = config;

  return {
    def: {
      type: 'number',
      required: stringify(required),
      minValue,
      maxValue,
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && (isUndefined(value) || value === '')) return error('propertype-missing');
      if (isUndefined(value)) return;
      if (typeof value === 'object') return error('propertype-type');
      if (typeof value === 'function') return error('propertype-type');
      if (Number.isNaN(+value)) return error('propertype-type');
      if (minValue && value < minValue) return error('propertype-number-min');
      if (maxValue && value > maxValue) return error('propertype-number-max');
    },
    construct: value => Number(value),
  };
};

module.exports.number = number;

const object = (config = {}) => {
  const { required = false } = config;

  return {
    def: {
      type: 'object',
      required: stringify(required),
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && isUndefined(value)) return error('propertype-missing');
      if (isUndefined(value)) return;
      if (typeof value !== 'object') return error('propertype-type');
      if (Array.isArray(value)) return error('propertype-type');
    },
    construct: value => ({ ...value }),
  };
};

module.exports.object = object;

const email = (config = {}) => {
  const { required = false } = config;

  // eslint-disable-next-line no-useless-escape
  const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return {
    def: {
      type: 'email',
      required: stringify(required),
    },
    func: string({ required, pattern: emailPattern }).func,
    construct: value => String(value),
  };
};

module.exports.email = email;

const oneOf = (config = {}) => {
  const { required = false, items = [] } = config;

  return {
    def: {
      type: 'oneOf',
      required: stringify(required),
      items,
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && isUndefined(value)) return error('propertype-missing');
      if (isUndefined(value)) return;
      if (!items.includes(value)) return error('propertype-type');
    },
    construct: value => value,
  };
};

module.exports.oneOf = oneOf;

const arrayOf = (config = {}) => {
  const { required = false, minLength, maxLength, type = any() } = config;

  return {
    def: {
      type: 'arrayOf',
      required: stringify(required),
      type: type.def,
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && isUndefined(value)) return error('propertype-missing');
      if (isUndefined(value)) return;
      if (minLength && value.length < minLength) return error('propertype-array-min');
      if (maxLength && value.length > maxLength) return error('propertype-array-max');
      if (!Array.isArray(value)) return error('propertype-type');
      // eslint-disable-next-line no-plusplus
      const results = value.map(item => type.func(item));
      if (results.find(item => item !== undefined)) return results;
      return undefined;
    },
    construct: list => list.map(item => type.construct(item)),
  };
};

module.exports.arrayOf = arrayOf;

const shape = (config = {}) => {
  const { required = false, types = {} } = config;

  return {
    def: {
      type: 'shape',
      required: stringify(required),
      types: showTypes(types),
    },
    func: (value, props) => {
      const isRequired = (typeof required === 'function') ? required(props) : required;
      if (isRequired && isUndefined(value)) return error('propertype-missing');
      if (isUndefined(value)) return;
      if (typeof value !== 'object') return error('propertype-type');
      const result = checkTypes(types, value);
      if (Object.keys(result).length > 0) return result;
    },
    construct: value => Object.keys(types).reduce((obj, propId) => ({
      ...obj,
      [propId]: types[propId].construct(value[propId]),
    }), {}),
  };
};

module.exports.shape = shape;

const hidden = (type = any()) => {
  return {
    def: { type: 'hidden' },
    func: type.func,
    construct: value => value,
  };
};

module.exports.hidden = hidden;

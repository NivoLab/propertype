const error = type => type;
module.exports.error = error;

const isUndefined = value => (typeof value === 'undefined');
module.exports.isUndefined = isUndefined;

const testPattern = (pattern, input) => new RegExp(pattern).test(input);
module.exports.testPattern = testPattern;

const stringify = value => {
  if (typeof value === 'function') return `(${value.toString()})`;
  return value.toString();
};

module.exports.stringify = stringify;

const validate = (types, props) => {
  const propResults = Object.keys(types)
    .reduce((propResults, propId) => {
      const rule = types[propId];
      const value = props[propId];
      const ruleResult = rule.validate(value, props);
      if (!ruleResult) return propResults;

      return { ...propResults, [propId]: ruleResult };
    }, {});

  return propResults;
};

module.exports.validate = validate;

const explain = types => {
  return Object.keys(types)
    .filter(propId => types[propId].def.type !== 'hidden')
    .reduce((propResults, propId) => {
      const type = types[propId];
      return {
        ...propResults,
        [propId]: {
          ...type.def,
          funcString: stringify(type.validate),
        },
      };
    }, {});
};

module.exports.explain = explain;

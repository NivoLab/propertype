const core = require('./core.js');
const string = require('./string.js');

const _email = core.createType(config => {
  const { required = false } = config;

  // eslint-disable-next-line no-useless-escape
  const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const def = {
    type: 'email',
    required: core.stringify(required),
  };

  const construct = value => String(value);
  const validate = string({ required, pattern: emailPattern }).validate;

  const output = construct;
  output.construct = construct;
  output.def = def;
  output.validate = validate;

  return output;
});

module.exports = _email;

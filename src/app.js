const any = require('./any.js');
const boolean = require('./boolean.js');
const string = require('./string.js');
const number = require('./number.js');
const object = require('./object.js');
const email = require('./email.js');
const oneOf = require('./oneOf.js');
const arrayOf = require('./arrayOf.js');
const shape = require('./shape.js');

const Propertype = types =>  shape({ required: true, types });
Propertype.any = any;
Propertype.boolean = boolean;
Propertype.string = string;
Propertype.number = number;
Propertype.object = object;
Propertype.email = email;
Propertype.oneOf = oneOf;
Propertype.arrayOf = arrayOf;
Propertype.shape = shape;

module.exports = Propertype;

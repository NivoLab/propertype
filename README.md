# propertype
a struct constructor/validator library. propertype is a tool to check if an object has the proper type on its properties. as a constructor, it will extract properties defined in its type out of the payload it has been given.

## installation
```sh
$ npm i propertype --save
```

## possible types
- `any`: anything
  - `required`: boolean - default: `false` - error: `propertype-required`
- `boolean`: boolean or string of `'true'` or `'false'`
  - `required`: boolean - default: `false` - error: `propertype-required`
- `number`: number or a string of a number
  - `required`: boolean - default: `false` - error: `propertype-required`
  - `min`: minimum value - error: `propertype-number-min`
  - `max`: maximum value - error: `propertype-number-max`
- `string`: a string
  - `required`: boolean - default: `false` - error: `propertype-required`
  - `min`: minimum string length - error: `propertype-string-min`
  - `max`: maximum string length - error: `propertype-string-max`
  - `pattern`: a regex pattern to test against - default: `.*` - error: `propertype-string-pattern`
- `object`: any object without caring about its properties
  - `required`: boolean - default: `false` - error: `propertype-required`
- `oneOf`: the value should equal one of the values in its options key
  - `required`: boolean - default: `false` - error: `propertype-required`
  - `options`: array of possible values - error: `propertype-oneof-options`
- `arrayOf`: an array of a specific type
  - `required`: boolean - default: `false` - error: `propertype-required`
  - `min`: minimum array length - error: `propertype-array-min`
  - `max`: maximum array length - error: `propertype-array-max`
  - `type`: the specific type that all values in the array should be - default: `any`
- `shape`: shape is like a nested propertype config
  - `required`: boolean - default: `false` - error: `propertype-required`
  - `types`: an object of property configurations, just like its top level one


## usage example
```js
const Propertype = require('propertype');

// define a struct
const Person = Propertype({
  name: Propertype.string({ required: true, min: 3, max: 255 }),
  gender: Propertype.oneOf({ required: true, options: [ 'male', 'female' ] }),
  married: Propertype.boolean,
  age: Propertype.number, // you can skip parens if the default type config is good for you (required: false)
  skills: Propertype.arrayOf({ required: true, type: Propertype.string }),
  email: Propertype.email.required, // that's right! you can do this just like prop-types allows you
  outfit: Propertype.shape({ types: {
    shirtColor: Propertype.string,
    jeansColor: Propertype.string,
    sneakerSize: Propertype.number({ min: 30, max: 50 }),
  }}),
  extras: Propertype.any,
});

const payload = {
  name: 'Dariush Alipour',
  gender: 'male',
  married: true,
  age: 26,
  skills: ['js', 'golang'],
  email: 'drsh.alipour@gmail.com',
  outfit: {
    shirtColor: 'black',
    jeansColor: 'blue',
    sneakerSize: 55,
  },
};

// check/validate types
const errors = Person.validate(payload); // return: { outfit: { sneakerSize: 'propertype-number-max' } }

// explain type rules
const rules = Person.explain();

// construct one
const person = Person(payload);

```

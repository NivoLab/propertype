# propertype
a struct constructor/validator library

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
  email: Propertype.email({ required: true }),
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

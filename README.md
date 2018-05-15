# propertype
a struct constructor/validator library

## usage example
```js
import * as Propertype from 'propertype';

// define a struct
const Person = {
  name: Propertype.string({ required: true, minLength: 3, maxLength: 255 }),
  age: Propertype.number({ minValue: 13 }),
};

// check/validate types
const errors = Propertype.validate(Person, { name: 'Dariush Alipour', age: 25 });

// explain type rules
const rules = Propertype.explain(Person);

```

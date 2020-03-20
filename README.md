```js
const source = "(print (if (lt? 2 5) (sum 2 2) (div 4 2)))"

const globalEnv = makeEnv()

evaluate(parse(tokenize(source)), globalEnv) // 4
```

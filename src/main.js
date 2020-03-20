"use strict"

const isNumber = (atom) => atom.type === "number"

const isSymbol = (atom) => atom.type === "symbol"

const makeEnv = () => ({
  sum: (a, b) => a + b,
  sub: (a, b) => a - b,
  mult: (a, b) => a * b,
  div: (a, b) => a / b,
  "lt?": (a, b) => a < b,
  "qt?": (a, b) => a > b,
  not: (a) => !a,
  "eq?": (a, b) => a === b,
  "null?": (a) => a === null,
  "number?": (a) => a >= "0" && a <= "9",
  identity: (a) => a,
  begin: (xs) => xs[xs.length - 1],
  print: console.log,
})

const tokenize = (string) =>
  string
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .split(" ")
    .filter(Boolean)

const atom = (token) =>
  /^[0-9]+$/.test(token)
    ? { type: "number", lexeme: Number(token) }
    : { type: "symbol", lexeme: token }

const parse = (tokens) => {
  if (tokens.length === 0) {
    throw new Error("Unexpected end of input")
  }

  const token = tokens.shift()
  if (token === "(") {
    const left = []

    while (tokens[0] !== ")") {
      left.push(parse(tokens))
    }

    tokens.shift()

    return left
  }

  if (token === ")") {
    throw new Error("Unexpected ')'")
  }

  return atom(token)
}

const evaluate = (expression, env) => {
  if (isSymbol(expression)) {
    return env[expression.lexeme]
  }

  if (isNumber(expression)) {
    return expression.lexeme
  }

  const [firstAtom] = expression

  if (firstAtom.lexeme === "if") {
    const [, condition, then, _else] = expression
    const expr = evaluate(condition, env) ? then : _else
    return evaluate(expr, env)
  }

  if (firstAtom.lexeme === "define") {
    const [, symbol, expr] = expression

    env[symbol.lexeme] = evaluate(expr, env)
  } else {
    const procedure = evaluate(firstAtom, env)

    if (typeof procedure !== "function") {
      return procedure
    }

    const args = expression.slice(1).map((x) => evaluate(x, env))

    return procedure(...args)
  }
}

const source = "(print (if (lt? 2 5) (sum 2 2) (div 4 2)))"

const globalEnv = makeEnv()

evaluate(parse(tokenize(source)), globalEnv)

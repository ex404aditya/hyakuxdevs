/*
  Implement a class `Calculator` having below methods
    - initialise a result variable in the constructor and keep updating it after every arithmetic operation
    - add: takes a number and adds it to the result
    - subtract: takes a number and subtracts it from the result
    - multiply: takes a number and multiply it to the result
    - divide: takes a number and divide it to the result
    - clear: makes the `result` variable to 0
    - getResult: returns the value of `result` variable
    - calculate: takes a string expression which can take multi-arithmetic operations and give its result
      example input: `10 +   2 *    (   6 - (4 + 1) / 2) + 7`
      Points to Note: 
        1. the input can have multiple continuous spaces, you're supposed to avoid them and parse the expression correctly
        2. the input can have invalid non-numerical characters like `5 + abc`, you're supposed to throw error for such inputs

  Once you've implemented the logic, test your code by running
*/

class Calculator {
  constructor() {
    this.result = 0;
  }

  add(num) {
    if (typeof num != "number") {
      throw new Error("invalid input, pls put a number");
    }
    this.result += num;
    return this.result;
  }

  subtract(num) {
    if (typeof num != "number") {
      throw new Error("invalid input, pls put a number");
    }
    this.result -= num;
    return this.result;
  }

  multiply(num) {
    if (typeof num !== "number") {
      throw new Error("invalid input, pls put a number");
    }
    this.result *= num;
    return this.result;
  }

  divide(num) {
    if (typeof num !== "number") {
      throw new Error("invalid input, pls put a number");
    }
    if (num === 0) {
      throw new Error("division by 0 not allowed");
    }
    this.result /= num;
    return this.result;
  }

  clear() {
    this.result =0
  }

  getResult() {
    return this.result;
  }

  calculate(expression) {
    if (typeof expression !== 'string') {
        throw new Error('expression is to be string')
    }

    expression = expression.replace(/\s+/g, '')

    if (!/^[-+().*\/\d]+$/.test(expression)) {
        throw new Error('contains invalid characters');
    }

    try {
        expression = expression.replace(/([-+*/()])/g, ' $1 ')
                           .trim()
                           .split(/\s+/);

        return this.evaluateExpression(expression);
    } catch (error) {
        throw new Error('invalid expression: ' + error.message);
    }
}

evaluateExpression(tokens) {
  const outputQueue = [];
  const operatorStack = [];
  const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2
  };

  for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (!isNaN(token)) {
          outputQueue.push(Number(token));
      } else if (token in precedence) {
          while (
              operatorStack.length > 0 &&
              operatorStack[operatorStack.length - 1] !== '(' &&
              precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
          ) {
              outputQueue.push(operatorStack.pop());
          }
          operatorStack.push(token);
      } else if (token === '(') {
          operatorStack.push(token);
      } else if (token === ')') {
          let foundMatching = false;
          while (operatorStack.length > 0) {
              const operator = operatorStack.pop();
              if (operator === '(') {
                  foundMatching = true;
                  break;
              }
              outputQueue.push(operator);
          }
          if (!foundMatching) {
              throw new Error('mismatched parentheses');
          }
      }
  }

  while (operatorStack.length > 0) {
      const operator = operatorStack.pop();
      if (operator === '(') {
          throw new Error('mismatched parentheses');
      }
      outputQueue.push(operator);
  }

  const evaluationStack = [];
  for (const token of outputQueue) {
      if (typeof token === 'number') {
          evaluationStack.push(token);
      } else {
          const b = evaluationStack.pop();
          const a = evaluationStack.pop();
          if (a === undefined || b === undefined) {
              throw new Error('invalid expression');
          }

          switch (token) {
              case '+': evaluationStack.push(a + b); break;
              case '-': evaluationStack.push(a - b); break;
              case '*': evaluationStack.push(a * b); break;
              case '/':
                  if (b === 0) throw new Error('division by zero');
                  evaluationStack.push(a / b);
                  break;
          }
      }
  }

  if (evaluationStack.length !== 1) {
      throw new Error('invalid expression');
  }

  this.result = evaluationStack[0];
  return this.result;

}

}

module.exports = Calculator;

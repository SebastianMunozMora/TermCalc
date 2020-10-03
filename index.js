const readline = require('readline');
const ln = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ln.question("Insert expression to calculate:", (expression) => {
    const result = calculateExpression(expression)
    console.log(result);
    ln.close();
});

function calculateExpression(expression) {
    let result
    const sanitized = sanitizeExp(expression);
    
    result = parsePlusSeparatedExpression(sanitized, '+');
    return result;
}

function sanitizeExp(expression) {
    const regexp = /[^0-9^*\/()\-+.]/g
    return expression.replace(regexp, '');
}

function add(a,b) {
    return a + b;
}

function substract(a,b) {
    return a - b;
}

function multiply (a,b) {
    return a * b;
}

function divide (a,b) {
    return a / b;
}

function substract(a,b) {
    return a - b;
}
const split = (expression, operator) => {
    const result = [];
    let braces = 0;
    let currentChunk = "";
    for (let i = 0; i < expression.length; ++i) {
        const curCh = expression[i];
        if (curCh == '(') {
            braces++;
        } else if (curCh == ')') {
            braces--;
        }
        if (braces == 0 && operator == curCh) {
            result.push(currentChunk);
            currentChunk = "";
        } else currentChunk += curCh;
    }
    if (currentChunk != "") {
        result.push(currentChunk);
    }
    return result;
};
const parseMultiplicationSeparatedExpression = (expression) => {
    const numbersString = split(expression, '*');
    const numbers = numbersString.map(noStr => {
        if (noStr[0] == '(') {
            const expr = noStr.substr(1, noStr.length - 2);

            return parsePlusSeparatedExpression(expr);
        }
        return +noStr;
    });
    const initialValue = 1.0;
    const result = numbers.reduce((acc, no) => acc * no, initialValue);
    return result;
};

const parseMinusSeparatedExpression = (expression) => {
    const numbersString = split(expression, '-');
    const numbers = numbersString.map(noStr => parseMultiplicationSeparatedExpression(noStr));
    const initialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc, no) => acc - no, initialValue);
    return result;
};

const parsePlusSeparatedExpression = (expression) => {
    const numbersString = split(expression, '+');
    const numbers = numbersString.map(noStr => parseMinusSeparatedExpression(noStr));
    const initialValue = 0.0;
    const result = numbers.reduce((acc, no) => acc + no, initialValue);
    return result;
};
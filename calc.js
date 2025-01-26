const MAX_DIGITS = 9;
const displayText = document.querySelector('.display-text');
const memSymbol = document.querySelector('.mem-symbol');

const ops = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => y === 0 ? 'ERROR' : x / y,
};

const memoryOps = {
    'mem-add': () => {
        memoryValue += accumulator;
        setMemorySymbolVisibility();
    },
    'mem-recall': () => {
        accumulator = memoryValue;
        showNumber(accumulator);
    },
    'mem-clear': () => {
        memoryValue = 0;
        setMemorySymbolVisibility();
    },
}

const keyMap = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
    '7': '7', '8': '8', '9': '9', '+': '+', '-': '-', '*': '*', '/': '/',
    'enter': '=', '=': '=', 'escape': 'clear', 'c': 'clear', '.': '.',
    'insert': 'mem-add', 'm': 'mem-recall', 'delete': 'mem-clear',
};

let accumulator = 0;
let interimValue = 0;
let previousOp = null;

let hasDecimal = false;
let decimalFactor = 1;

let memoryValue = 0;

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key in keyMap) {
        event.preventDefault();
        calculate(keyMap[key]);
    }
});

document.querySelectorAll('.calc-button').forEach(button =>
    button.addEventListener('click', () => calculate(button.id)));

const processNumber = (number) => {
    let [integerPart, fractionalPart = ''] = number.toString().split('.');
    integerPart = integerPart || '0';
    if (integerPart.length > MAX_DIGITS)
        return 'OVERFLOW';
    fractionalPart = fractionalPart
        .substring(0, MAX_DIGITS - integerPart.length)
        .replace(/0+$/, '');
    return `${integerPart}.${fractionalPart}`;
}

const showNumber = async (text) => {
    displayText.style.opacity = 0;
    displayText.textContent = processNumber(text);
    await new Promise(r => setTimeout(r, 100));
    displayText.style.opacity = 1;
};

const calculate = (buttonPressed) => {
    switch (true) {
        case buttonPressed in ops:
            if (previousOp !== null)
                accumulator = ops[previousOp](interimValue, accumulator);
            interimValue = accumulator;
            showNumber(accumulator);
            accumulator = 0;
            previousOp = buttonPressed;
            hasDecimal = false;
            decimalFactor = 1;
            break;
        case buttonPressed in memoryOps:
            memoryOps[buttonPressed]();
            break;
        case buttonPressed === 'clear':
            accumulator = 0;
            interimValue = 0;
            previousOp = null;
            hasDecimal = false;
            decimalFactor = 1;
            showNumber(accumulator);
            break;
        case buttonPressed === '=':
            if (previousOp !== null) {
                const result = ops[previousOp](interimValue, accumulator);
                accumulator = result;
                interimValue = 0;
                previousOp = null;
            }
            hasDecimal = false;
            decimalFactor = 1;
            showNumber(accumulator);
            break;
        case buttonPressed === '.':
            if (!hasDecimal) {
                hasDecimal = true;
                decimalFactor = .1;
            }
            break;
        default:
            if (accumulator.toString().replace('.', '').length < MAX_DIGITS) {
                const digit = parseInt(buttonPressed, 10);
                if (hasDecimal) {
                    accumulator += digit * decimalFactor;
                    decimalFactor /= 10;
                } else {
                    accumulator = accumulator * 10 + digit
                }
            }
            showNumber(accumulator);
            break;
    }
};

const setMemorySymbolVisibility = async () => {
    memSymbol.style.display = 'none';
    memSymbol.style.visibility = 'hidden';
    await showNumber(accumulator);
    memSymbol.style.display = memoryValue !== 0 ? 'block' : 'none';
    memSymbol.style.visibility = memoryValue !== 0 ? 'visible' : 'hidden';
};

showNumber(accumulator);
setMemorySymbolVisibility();

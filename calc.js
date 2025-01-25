const MAX_DIGITS = 9;
const displayText = document.querySelector('.display-text');

const ops = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => y === 0 ? 'ERROR' : x / y,
};

let accumulator = 0;
let interimValue = 0;
let previousOp = null;

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
            break;
        case buttonPressed === 'clear':
            accumulator = 0;
            interimValue = 0;
            previousOp = null;
            showNumber(accumulator);
            break;
        case buttonPressed === '=':
            if (previousOp !== null) {
                const result = ops[previousOp](interimValue, accumulator);
                accumulator = result;
                interimValue = 0;
                previousOp = null;
            }
            showNumber(accumulator);
            break;
        default:
            if (accumulator.toString().length < MAX_DIGITS)
                accumulator = accumulator * 10 + parseInt(buttonPressed, 10);
            showNumber(accumulator);
            break;
    }
};

showNumber(accumulator);

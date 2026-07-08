const display = document.getElementById('display');
let currentFormula = "";
let isPowerOn = true;
let isCalculated = false;


window.onload = function() {
    const onOffBtn = document.querySelector('.on-off');
    onOffBtn.classList.add('on');
};

function togglePower() {
    isPowerOn = !isPowerOn;
    const buttons = document.querySelectorAll('button:not(.on-off)');
    const onOffBtn = document.querySelector('.on-off');

    if (isPowerOn) {
        display.value = "0";
        display.style.backgroundColor = "#222";
        onOffBtn.classList.add('on');
        buttons.forEach(btn => btn.disabled = false);
    } else {
        display.value = "";
        display.style.backgroundColor = "#111";
        onOffBtn.classList.remove('on');
        buttons.forEach(btn => btn.disabled = true);
        currentFormula = "";
        isCalculated = false;
    }
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function appendNumber(number) {
    if (!isPowerOn) return;
    
    
    if (isCalculated) {
        display.value = "";
        currentFormula = "";
        isCalculated = false;
    }

    if (display.value === "0" || display.value === "Error" || display.value === "DivBy0") {
        display.value = number;
        currentFormula = number;
    } else {
        display.value += number;
        currentFormula += number;
    }
}

function appendOperator(operator) {
    if (!isPowerOn) return;
    if (display.value === "Error" || display.value === "DivBy0") return;
    
    
    if (isCalculated) {
        isCalculated = false;
    }

    
    if (currentFormula === "") {
        currentFormula = "0";
    }

    
    if (currentFormula.endsWith(" ")) {
        currentFormula = currentFormula.slice(0, -3);
    }
    
    currentFormula += " " + operator + " ";
    display.value = currentFormula;
}

function clearDisplay() {
    if (!isPowerOn) return;
    display.value = "0";
    currentFormula = "";
    isCalculated = false;
}

function calculate(formula) {
    const tokens = formula.trim().split(/\s+/);
    if (tokens.length < 3 || tokens.length % 2 === 0) {
        return "Error";
    }

    
    const intermediateTokens = [];
    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        if (token === "*" || token === "/") {
            const left = Number(intermediateTokens.pop());
            const operator = token;
            const right = Number(tokens[i + 1]);

            if (isNaN(left) || isNaN(right)) return "Error";

            let res;
            if (operator === "*") {
                res = multiply(left, right);
            } else {
                if (right === 0) return "DivBy0";
                res = divide(left, right);
            }
            intermediateTokens.push(res);
            i += 2;
        } else {
            intermediateTokens.push(token);
            i++;
        }
    }

    
    let result = Number(intermediateTokens[0]);
    if (isNaN(result)) return "Error";

    for (let j = 1; j < intermediateTokens.length; j += 2) {
        const operator = intermediateTokens[j];
        const nextValue = Number(intermediateTokens[j + 1]);

        if (isNaN(nextValue)) return "Error";

        if (operator === "+") {
            result = add(result, nextValue);
        } else if (operator === "-") {
            result = subtract(result, nextValue);
        } else {
            return "Error";
        }
    }
    return result;
}

function performCalculate() {
    if (!isPowerOn || !currentFormula) return;
    
    
    if (currentFormula.endsWith(" ")) {
        currentFormula = currentFormula.trim();
    }

    const result = calculate(currentFormula);
    display.value = result;
    isCalculated = true;
    
    if (result === "Error" || result === "DivBy0") {
        currentFormula = "";
    } else {
        currentFormula = result.toString();
    }
}
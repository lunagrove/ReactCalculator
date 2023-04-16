import '../styles/App.css';
import { useState, useEffect } from "react";
import {calculatorButtons} from '../calculator-button-data';

import Header from "./Header";
import Display from "./Display";
import Button from "./Button";

function App() {
  
  let displayText = "";
  let memoryValue = 0;
  let operand1 = "";
  let operand2 = "";
  let operator = "";

  useEffect(() => {
    setOutputStr(displayText);
  }, [displayText]);

  const [outputStr, setOutputStr] = useState(displayText);
  const [memoryOut, setMemoryOut] = useState("");
  const [op1, setOp1] = useState(operand1);
  const [op2, setOp2] = useState(operand2);
  const [opr, setOpr] = useState(operator);

  function handleClick(value, type, text) {
    displayText = outputStr;
    memoryValue = memoryOut;
    operand1 = op1;
    operand2 = op2;
    operator = opr;
    let num = 0;

    /*  For square root, percent, memory, sign and equal functions,
    calculate the answer before performing the function in case an
    expression has been entered */

    if (type === "sqrt" || type === "percent" ||
        (type === "memory" && text !== "MR") || type === "sign") {
      if (operand1 !== "" & operand2 !== "") {
        operand1 = calculateAnswer(operand1, operand2, operator);
        operand2 = "";  
        operator = "";               
        displayText = operand1;
      }
    }

    switch (type) {
      case ("number"):
        if (text === '.') {
          let lastChar = displayText.charAt(displayText.length - 1);
          if (lastChar === '.') {
            break;
          }
          if (operator !== "") {
            if (operand2 !== "" & containsDecimal(operand2)) {
              break;
            }
          }
          else {
            if (operand1 !== "" & containsDecimal(operand1)) {
              break;
            }
          }
        }
        let leadingZero = "";
        if (operator !== "") {
          if (text === '.' & operand2 === "") {
            leadingZero = "0";
          }
          operand2 = operand2 + leadingZero + text;
        }
        else {
          if (text === '.' & operand1 === "") {
            leadingZero = "0";
          }
          operand1 = operand1 + leadingZero + text;
        }
        displayText = displayText.toString() + leadingZero + text;
        break;
      case ("sign"):
        if (operand1 === "") {
          break;
        }
        (containsDecimal(operand1)) ? num = parseFloat(operand1) : num = parseInt(operand1);
        num = -num;
        operand1 = num.toString();
        displayText = num.toString();
        break;
      case ("operator"):
        if (operator === "" & operand1 !== "") {
          operator = text;
          displayText = displayText.toString() + text;
        }
        else {
          if (operand1 !== "" & operand2 !== "") {
            operand1 = calculateAnswer(operand1, operand2, operator);
            operand2 = "";
            operator = text;
            displayText = operand1 + text;
          }
        }
        break;
      case ("enter"):
        if (operand1 !== "" & operand2 !== "") {
          operand1 = calculateAnswer(operand1, operand2, operator);
          operand2 = "";
          operator = "";
          displayText = operand1;
        }
        break;
      case ("clear"):
        if (value === "All Clear") {
          displayText = "";
          operand1 = "";
          operand2 = "";
          operator = "";
        }
        if (value === "Clear") {
          let lastChar = displayText.charAt(displayText.length - 1);
          displayText = displayText.toString().slice(0, -1);
          if (!isOperator(lastChar)) {
            if (operand2 !== "") {
              operand2 = operand2.toString().slice(0, -1);
            }
            else {
              operand1 = operand1.toString().slice(0, -1);
              if (operand1 === "-") {
                operand1 = "";
                displayText = "";
              }  
            }
          }
          else {
            operator = "";
            operand2 = "";
          }
        }
        break;
      case ("sqrt"):
        (containsDecimal(operand1)) ? num = parseFloat(operand1) : num = parseInt(operand1);
        if (num > 0) {
          const result = parseFloat(Math.sqrt(num).toFixed(6));
          displayText = result.toString();
          operand1 = result.toString();
        }
        break;
      case ("percent"):
        (containsDecimal(operand1)) ? num = parseFloat(operand1) : num = parseInt(operand1);
        if (num > 0) {
          num = num / 100;
          const result = parseFloat(num.toFixed(6));
          displayText = result.toString();
          operand1 = result.toString();
        }
        break;
      case ("memory"):
        switch(text) {
          case ("MS"):
            if (operand1 !== "") {
              (containsDecimal(operand1)) ? memoryValue = parseFloat(operand1)
                                           : memoryValue = parseInt(operand1);
            }
            break;
          case ("MC"):
            memoryValue = 0;
            break;
          case ("MR"):
            let lastChar = displayText.charAt(displayText.length - 1);
            if (!isOperator(lastChar)) {
              displayText = memoryValue.toString();
              operand1 = memoryValue.toString();
              operand2 = "";
              operator = "";
            }
            else
            {
              displayText = displayText.toString() + memoryValue.toString();
              operand2 = memoryValue.toString();
            }
            break;
          case ("M+"):
            if (operand1 !== "") {
              if (memoryValue === "") {
                (containsDecimal(operand1)) ? memoryValue = parseFloat(operand1)
                                            : memoryValue = parseInt(operand1);
              }
              else {
                memoryValue = parseFloat(calculateAnswer(memoryValue.toString(), operand1, "+"));
              }
            }
            break;
          case ("M-"):
            if (operand1 !== "") {
              if (memoryValue === "") {
                (containsDecimal(operand1)) ? memoryValue = 0 - parseFloat(operand1)
                                            : memoryValue = 0 - parseInt(operand1);
              }
              else {
                memoryValue = parseFloat(calculateAnswer(memoryValue.toString(), operand1, "-"));
              }
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    setOp1(operand1);
    setOp2(operand2);
    setOpr(operator);

    if (displayText.length > 23) {
      displayText = displayText.substring(0, 23);
    }
    setOutputStr(displayText);
    setMemoryOut(memoryValue !== 0 ? memoryValue.toString() : "");
  }

  function calculateAnswer(op1, op2, opr) {
    let currentText = "";
    let num1 = 0;
    let num2 = 0;
    let answer = 0;

    (containsDecimal(op1)) ? num1 = parseFloat(op1) : num1 = parseInt(op1);
    (containsDecimal(op2)) ? num2 = parseFloat(op2) : num2 = parseInt(op2);

/*  Perform the correct function on the two numbers */
    switch (opr) {
      case "+":
        if (containsDecimal(op1) || containsDecimal(op2)) {
          answer = parseFloat(num1 + num2).toFixed(6);
        }
        else {
          answer = (num1 + num2);
        }
        break;
      case "-":
        if (containsDecimal(op1) || containsDecimal(op2)) {
          answer = parseFloat(num1 - num2).toFixed(6);
        }
        else {
          answer = (num1 - num2);
        }
        break;
      case "\u00d7":
        if (containsDecimal(op1) || containsDecimal(op2)) {
          answer = parseFloat(num1 * num2).toFixed(6);
        }
        else {
          answer = (num1 * num2);
        }
        break;
      case "\u00f7":
        answer = parseFloat(num1 / num2).toFixed(6);
        break;
      default:
        break;
    }
    currentText = parseFloat(answer).toString();

    if (currentText.length > 23) {
      currentText = currentText.substring(0, 23);
    }
    return currentText;
  }

  function isOperator(text) {
    return (text === "+" || text === "-" ||
            text === "\u00d7" || text === "\u00f7") 
  }

  function containsDecimal(text) {
    for (let i = 1; i < text.length; i++) {
      if (text[i] === ".") {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="App">
      <main>
        <Header/>
        <Display
          text={outputStr}
          memoryText={memoryOut}/>
        <div className="Button-grid">  
            {calculatorButtons.map(btn => (
            <Button
              key={btn.value}
              type={btn.type}
              text={btn.text}
              value={btn.value}
              className={btn.className}
              color={btn.color}
              textColor={btn.textColor}
              handleClick={handleClick}
            />
            ))}        
        </div>
      </main>
    </div>
  );
}

export default App;

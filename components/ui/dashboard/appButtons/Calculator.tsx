"use client";

import React, { useState } from "react";
import styles from "./Calculator.module.css";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);

  const handleNum = (num: string) => {
    if (display === "0") setDisplay(num);
    else setDisplay(display + num);
  };

  const handleOp = (op: string) => {
    setPrevious(parseFloat(display));
    setOperator(op);
    setDisplay("0");
  };

  const calculate = () => {
    if (previous === null || operator === null) return;
    const current = parseFloat(display);
    let result = 0;
    switch (operator) {
      case "+":
        result = previous + current;
        break;
      case "-":
        result = previous - current;
        break;
      case "*":
        result = previous * current;
        break;
      case "/":
        result = previous / current;
        break;
    }
    setDisplay(result.toString());
    setPrevious(null);
    setOperator(null);
  };

  const clear = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.display}>{display}</div>
      <div className={styles.keypad}>
        <button className={`${styles.btn} ${styles.btnSpec}`} onClick={clear}>
          C
        </button>
        <button
          className={`${styles.btn} ${styles.btnSpec}`}
          onClick={() => setDisplay((parseFloat(display) * -1).toString())}
        >
          +/-
        </button>
        <button
          className={`${styles.btn} ${styles.btnSpec}`}
          onClick={() => setDisplay((parseFloat(display) / 100).toString())}
        >
          %
        </button>
        <button
          className={`${styles.btn} ${styles.btnOp}`}
          onClick={() => handleOp("/")}
        >
          ÷
        </button>

        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("7")}
        >
          7
        </button>
        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("8")}
        >
          8
        </button>
        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("9")}
        >
          9
        </button>
        <button
          className={`${styles.btn} ${styles.btnOp}`}
          onClick={() => handleOp("*")}
        >
          ×
        </button>

        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("4")}
        >
          4
        </button>
        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("5")}
        >
          5
        </button>
        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("6")}
        >
          6
        </button>
        <button
          className={`${styles.btn} ${styles.btnOp}`}
          onClick={() => handleOp("-")}
        >
          -
        </button>

        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("1")}
        >
          1
        </button>
        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("2")}
        >
          2
        </button>
        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum("3")}
        >
          3
        </button>
        <button
          className={`${styles.btn} ${styles.btnOp}`}
          onClick={() => handleOp("+")}
        >
          +
        </button>

        <button
          className={`${styles.btn} ${styles.btnNum} ${styles.zero}`}
          onClick={() => handleNum("0")}
        >
          0
        </button>
        <button
          className={`${styles.btn} ${styles.btnNum}`}
          onClick={() => handleNum(".")}
        >
          .
        </button>
        <button className={`${styles.btn} ${styles.btnOp}`} onClick={calculate}>
          =
        </button>
      </div>
    </div>
  );
}

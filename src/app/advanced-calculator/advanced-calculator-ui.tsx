
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// A simple expression parser. Not a full-fledged one, but safer than eval.
const evaluateExpression = (expr: string): number => {
  // Add spaces around operators to help with tokenization
  expr = expr.replace(/([+\-*/^()√])/g, ' $1 ');

  const tokens = expr.trim().split(/\s+/).map(token => {
    if (token === 'π') return String(Math.PI);
    if (token === 'e') return String(Math.E);
    return token;
  });

  const values: number[] = [];
  const ops: string[] = [];

  const precedence: { [key: string]: number } = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3, '√': 4, 'sin': 4, 'cos': 4, 'tan': 4, 'log': 4, 'ln': 4 };
  const applyOp = () => {
    const op = ops.pop()!;
    if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(op)) {
        const a = values.pop()!;
        switch(op) {
            case 'sin': values.push(Math.sin(a)); break;
            case 'cos': values.push(Math.cos(a)); break;
            case 'tan': values.push(Math.tan(a)); break;
            case 'log': values.push(Math.log10(a)); break;
            case 'ln': values.push(Math.log(a)); break;
            case '√': values.push(Math.sqrt(a)); break;
        }
    } else {
        const b = values.pop()!;
        const a = values.pop()!;
        switch (op) {
          case '+': values.push(a + b); break;
          case '-': values.push(a - b); break;
          case '*': values.push(a * b); break;
          case '/': 
            if(b === 0) throw new Error("Division by zero");
            values.push(a / b); 
            break;
          case '^': values.push(Math.pow(a, b)); break;
        }
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (!isNaN(parseFloat(token))) {
      values.push(parseFloat(token));
    } else if (token === '(') {
      ops.push(token);
    } else if (token === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        applyOp();
      }
      ops.pop(); // Pop '('
    } else if (precedence[token]) {
      // Handle unary minus or function context
      const lastToken = i > 0 ? tokens[i-1] : null;
      if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(token) && (lastToken === null || precedence[lastToken] || lastToken === '(') ) {
          ops.push(token);
          continue;
      }
      
      while (ops.length && precedence[ops[ops.length - 1]] >= precedence[token]) {
        applyOp();
      }
      ops.push(token);
    }
  }

  while (ops.length) {
    applyOp();
  }

  return values[0];
};

export function AdvancedCalculatorUI() {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");

  const handleInput = (value: string) => {
    if (display === "Error") {
      setExpression(value);
      setDisplay(value);
      return;
    }
    if (display === "0" && !'()+-*/^.√'.includes(value)) {
      setExpression(value);
      setDisplay(value);
    } else {
      setExpression(prev => prev + value);
      setDisplay(prev => prev + value);
    }
  };

  const handleFunction = (func: string) => {
    if (display === "Error") {
        setExpression("");
        setDisplay("0");
        return;
    }
    handleInput(`${func}(`);
  };
  
  const handleConstant = (c: string) => {
      const val = c;
      const lastChar = expression.slice(-1);
      if (display === "0" || display === "Error" || ['+', '-', '*', '/','^', '('].includes(lastChar) || lastChar === '') {
          handleInput(val);
      } else {
          handleInput(`*${val}`);
      }
  };
  
  const handleClear = () => {
    setExpression("");
    setDisplay("0");
  };

  const handleBackspace = () => {
    if (display === "Error") {
      handleClear();
      return;
    }
    if (expression.length > 1) {
      setExpression(prev => prev.slice(0, -1));
      setDisplay(prev => prev.slice(0, -1));
    } else {
      handleClear();
    }
  };

  const handleCalculate = () => {
    if (expression === "") return;
    try {
      // Balance parentheses
      const openParen = (expression.match(/\(/g) || []).length;
      const closeParen = (expression.match(/\)/g) || []).length;
      let balancedExpression = expression + ')'.repeat(openParen - closeParen);

      const result = evaluateExpression(balancedExpression);
      if(isNaN(result) || !isFinite(result)){
        throw new Error("Invalid calculation");
      }
      const resultString = String(result);
      setDisplay(resultString);
      setExpression(resultString);
    } catch (error) {
      setDisplay("Error");
      setExpression("");
    }
  };

  const buttons = [
    { label: "sin", type: "func" }, { label: "cos", type: "func" }, { label: "tan", type: "func" }, { label: "C", type: "clear" }, { label: "⌫", type: "backspace"},
    { label: "log", type: "func" }, { label: "ln", type: "func" }, { label: "(", type: "op" }, { label: ")", type: "op" }, { label: "√", type: "func" },
    { label: "7", type: "num" }, { label: "8", type: "num" }, { label: "9", type: "num" }, { label: "/", type: "op" }, { label: "^", type: "op" },
    { label: "4", type: "num" }, { label: "5", type: "num" }, { label: "6", type: "num" }, { label: "*", type: "op" }, { label: "π", type: "const" },
    { label: "1", type: "num" }, { label: "2", type: "num" }, { label: "3", type: "num" }, { label: "-", type: "op" }, { label: "e", type: "const" },
    { label: "0", type: "num" }, { label: ".", type: "num" }, { label: "=", type: "calc" }, { label: "+", type: "op" },
  ];

  const handleButtonClick = (label: string, type: string) => {
    switch (type) {
      case "num":
      case "op":
        handleInput(label);
        break;
      case "const":
        handleConstant(label);
        break;
      case "func":
        handleFunction(label);
        break;
      case "clear":
        handleClear();
        break;
      case "backspace":
        handleBackspace();
        break;
      case "calc":
        handleCalculate();
        break;
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <Input
          readOnly
          value={display}
          className="text-right text-4xl font-mono h-20 pr-4 bg-muted overflow-x-auto"
          aria-live="polite"
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              variant={
                btn.type === "num" || btn.type === "const" ? "outline" : 
                btn.type === 'calc' ? 'default' :
                btn.type === 'clear' || btn.type === 'backspace' ? 'secondary' : 'destructive'
              }
              size="lg"
              className={`text-lg ${btn.label === "0" ? "col-span-2" : ""}`}
              onClick={() => handleButtonClick(btn.label, btn.type)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

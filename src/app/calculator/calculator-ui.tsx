
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CalculatorUI() {
  const [display, setDisplay] = useState("0");
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const handleNumberClick = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };
  
  const handleDecimalClick = () => {
    if (waitingForOperand) {
        setDisplay("0.");
        setWaitingForOperand(false);
        return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(String(inputValue));
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setPreviousValue(String(result));
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const calculate = (prev: string, current: number, op: string) => {
    const prevNum = parseFloat(prev);
    switch (op) {
      case "+": return prevNum + current;
      case "-": return prevNum - current;
      case "*": return prevNum * current;
      case "/": 
        if(current === 0) return NaN; // Indicate error
        return prevNum / current;
      default: return current;
    }
  }

  const handleClear = () => {
    setDisplay("0");
    setCurrentValue(null);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };
  
  const handleToggleSign = () => {
    if(display !== "0") {
        setDisplay(String(parseFloat(display) * -1));
    }
  }
  
  const handlePercent = () => {
      setDisplay(String(parseFloat(display) / 100));
  }


  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <Input
          readOnly
          value={display}
          className="text-right text-4xl font-mono h-20 pr-4 bg-muted"
          aria-live="polite"
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
            <Button variant="secondary" size="lg" className="text-xl" onClick={handleClear}>C</Button>
            <Button variant="secondary" size="lg" className="text-xl" onClick={handleToggleSign}>+/-</Button>
            <Button variant="secondary" size="lg" className="text-xl" onClick={handlePercent}>%</Button>
            <Button variant="destructive" size="lg" className="text-xl" onClick={() => performOperation("/")}>÷</Button>
            
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("7")}>7</Button>
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("8")}>8</Button>
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("9")}>9</Button>
            <Button variant="destructive" size="lg" className="text-xl" onClick={() => performOperation("*")}>×</Button>
            
            <Button variant="outline" size="lg"className="text-xl" onClick={() => handleNumberClick("4")}>4</Button>
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("5")}>5</Button>
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("6")}>6</Button>
            <Button variant="destructive" size="lg" className="text-xl" onClick={() => performOperation("-")}>-</Button>
            
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("1")}>1</Button>
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("2")}>2</Button>
            <Button variant="outline" size="lg" className="text-xl" onClick={() => handleNumberClick("3")}>3</Button>
            <Button variant="destructive" size="lg" className="text-xl" onClick={() => performOperation("+")}>+</Button>
            
            <Button variant="outline" size="lg" className="col-span-2 text-xl" onClick={() => handleNumberClick("0")}>0</Button>
            <Button variant="outline" size="lg" className="text-xl" onClick={handleDecimalClick}>.</Button>
            <Button variant="default" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl" onClick={() => performOperation("=")}>=</Button>
        </div>
      </CardContent>
    </Card>
  );
}

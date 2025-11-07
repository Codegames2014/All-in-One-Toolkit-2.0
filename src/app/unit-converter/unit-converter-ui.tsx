"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const conversionFactors = {
  length: {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    miles: 1609.34,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254,
  },
  weight: {
    grams: 1,
    kilograms: 1000,
    milligrams: 0.001,
    pounds: 453.592,
    ounces: 28.3495,
  },
  temperature: {
    celsius: (c: number) => c,
    fahrenheit: (f: number) => (f - 32) * 5 / 9,
    kelvin: (k: number) => k - 273.15,
  }
};

const tempOutputConversions = {
    celsius: (c: number) => c,
    fahrenheit: (c: number) => (c * 9/5) + 32,
    kelvin: (c: number) => c + 273.15,
}

type UnitType = keyof typeof conversionFactors;
type LengthUnit = keyof typeof conversionFactors.length;
type WeightUnit = keyof typeof conversionFactors.weight;
type TempUnit = keyof typeof conversionFactors.temperature;

export function UnitConverterUI() {
  const [unitType, setUnitType] = useState<UnitType>("length");
  const [fromUnit, setFromUnit] = useState<string>("meters");
  const [toUnit, setToUnit] = useState<string>("feet");
  const [inputValue, setInputValue] = useState<string>("1");

  const unitsForType = useMemo(() => {
    return Object.keys(conversionFactors[unitType]);
  }, [unitType]);

  // Reset units when type changes
  useState(() => {
    setFromUnit(unitsForType[0]);
    setToUnit(unitsForType[1] || unitsForType[0]);
  });

  const outputValue = useMemo(() => {
    const fromVal = parseFloat(inputValue);
    if (isNaN(fromVal)) return "";

    if (unitType === 'temperature') {
      const from = fromUnit as TempUnit;
      const to = toUnit as TempUnit;
      const baseCelsius = conversionFactors.temperature[from](fromVal);
      const result = tempOutputConversions[to](baseCelsius);
      return result.toFixed(2);
    } else {
      const factors = conversionFactors[unitType] as Record<string, number>;
      const baseValue = fromVal * factors[fromUnit];
      const result = baseValue / factors[toUnit];
      return result.toFixed(5);
    }
  }, [inputValue, fromUnit, toUnit, unitType]);
  
  const swapUnits = () => {
      setFromUnit(toUnit);
      setToUnit(fromUnit);
      setInputValue(outputValue);
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Select a category and convert between units.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="unit-type">Category</Label>
            <Select value={unitType} onValueChange={(val) => setUnitType(val as UnitType)}>
                <SelectTrigger id="unit-type">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="length">Length</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr] items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-unit">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger id="from-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitsForType.map(unit => <SelectItem key={unit} value={unit} className="capitalize">{unit}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              id="input-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <Button variant="ghost" size="icon" className="w-full" onClick={swapUnits}>
            <ArrowRightLeft className="h-5 w-5" />
          </Button>

          <div className="space-y-2">
            <Label htmlFor="to-unit">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger id="to-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitsForType.map(unit => <SelectItem key={unit} value={unit} className="capitalize">{unit}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input id="output-value" readOnly value={outputValue} className="font-bold bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

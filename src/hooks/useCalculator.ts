import { useState } from "react";
import { calculateCarbonFootprint } from "../services/gemini";

export function useCalculator() {
  const [calcData, setCalcData] = useState({ transport: 50, energy: 200, diet: "omnivore" });
  const [calcResult, setCalcResult] = useState<any>(null);
  const [isCalcLoading, setIsCalcLoading] = useState(false);

  const handleCalculate = async () => {
    setIsCalcLoading(true);
    const result = await calculateCarbonFootprint(calcData);
    setCalcResult(result);
    setIsCalcLoading(false);
  };

  return { calcData, setCalcData, calcResult, isCalcLoading, handleCalculate };
}

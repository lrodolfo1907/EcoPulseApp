import { useState } from "react";
import { calculateCarbonFootprint } from "../services/gemini";
import { useTranslation } from "react-i18next";

export function useCalculator() {
  const { i18n } = useTranslation();
  const [calcData, setCalcData] = useState({ transport: 50, energy: 200, diet: "omnivore" });
  const [calcResult, setCalcResult] = useState<any>(null);
  const [isCalcLoading, setIsCalcLoading] = useState(false);

  const handleCalculate = async () => {
    setIsCalcLoading(true);
    const result = await calculateCarbonFootprint({ ...calcData, lang: i18n.language });
    setCalcResult(result);
    setIsCalcLoading(false);
  };

  return { calcData, setCalcData, calcResult, isCalcLoading, handleCalculate };
}

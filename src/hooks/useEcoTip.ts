import { useState, useEffect } from "react";
import { getEcoTip } from "../services/gemini";
import { useTranslation } from "react-i18next";

export function useEcoTip(user: any) {
  const { i18n } = useTranslation();
  const [aiTip, setAiTip] = useState("Loading your daily eco-tip...");
  const [isTipLoading, setIsTipLoading] = useState(false);

  const fetchTip = async (forceRefresh = false) => {
    setIsTipLoading(true);
    const lang = i18n.language;
    
    const CACHE_KEY = `ecoCatalyst_daily_tip_${lang}`;
    const CACHE_TIME_KEY = `ecoCatalyst_daily_tip_time_${lang}`;
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (!forceRefresh) {
      const cachedTip = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      
      if (cachedTip && cachedTime && (Date.now() - parseInt(cachedTime)) < ONE_DAY) {
        setAiTip(cachedTip);
        setIsTipLoading(false);
        return;
      }
    }

    const tip = await getEcoTip(undefined, lang);
    const finalTip = tip || "Small changes lead to big impacts!";
    
    setAiTip(finalTip);
    localStorage.setItem(CACHE_KEY, finalTip);
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    
    setIsTipLoading(false);
  };

  useEffect(() => {
    fetchTip();
  }, [user, i18n.language]);

  return { aiTip, isTipLoading, fetchTip };
}

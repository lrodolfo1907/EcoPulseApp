import { motion } from "motion/react";
import { Calculator as CalcIcon, RefreshCw, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CalculatorTabProps {
  calcData: { transport: number; energy: number; diet: string };
  setCalcData: (val: { transport: number; energy: number; diet: string }) => void;
  isCalcLoading: boolean;
  handleCalculate: () => void;
  calcResult: any;
  handleShare: (platform: string) => void;
}

export function CalculatorTab({
  calcData,
  setCalcData,
  isCalcLoading,
  handleCalculate,
  calcResult,
  handleShare
}: CalculatorTabProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="calculator"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-3xl mx-auto w-full"
    >
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-green-100 text-green-700 rounded-[1.5rem]">
            <CalcIcon size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{t('calculator.title')}</h2>
            <p className="text-gray-500 font-medium">{t('calculator.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 group-focus-within:text-green-600 transition-colors">{t('calculator.transport')}</label>
            <input 
              type="number" 
              value={calcData.transport}
              onChange={(e) => setCalcData({...calcData, transport: Number(e.target.value)})}
              className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg font-bold"
            />
          </div>
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 group-focus-within:text-green-600 transition-colors">{t('calculator.energy')}</label>
            <input 
              type="number" 
              value={calcData.energy}
              onChange={(e) => setCalcData({...calcData, energy: Number(e.target.value)})}
              className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg font-bold"
            />
          </div>
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 group-focus-within:text-green-600 transition-colors">{t('calculator.diet')}</label>
            <select 
              value={calcData.diet}
              onChange={(e) => setCalcData({...calcData, diet: e.target.value})}
              className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg font-bold appearance-none"
            >
              <option value="omnivore">{t('calculator.omnivore')}</option>
              <option value="vegetarian">{t('calculator.vegetarian')}</option>
              <option value="vegan">{t('calculator.vegan')}</option>
            </select>
          </div>

          <button 
            onClick={handleCalculate}
            disabled={isCalcLoading}
            className="w-full py-5 bg-green-700 hover:bg-green-600 text-white rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isCalcLoading ? <RefreshCw className="animate-spin" /> : <CalcIcon />}
            {isCalcLoading ? t('calculator.analyzing') : t('calculator.calculate')}
          </button>
        </div>

        {calcResult && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-8 bg-green-50 rounded-[2.5rem] border border-green-100 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-green-800 uppercase tracking-[0.2em] mb-6 text-center">{t('calculator.resultTitle')}</h3>
              <div className="text-center mb-8">
                <span className="text-7xl font-black text-green-700">{calcResult.total}</span>
                <span className="text-green-700 font-bold ml-3 text-xl">kg CO2e</span>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {Object.entries(calcResult.breakdown).map(([key, val]: any) => (
                  <div key={key} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl text-center border border-white">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-green-800 mb-1">{key}</p>
                    <p className="text-lg font-bold">{val}kg</p>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white rounded-3xl border border-green-100 shadow-sm">
                <p className="text-gray-600 font-medium italic leading-relaxed">"{calcResult.suggestion}"</p>
              </div>
              <button 
                onClick={() => handleShare("linkedin")}
                className="mt-6 w-full py-3 bg-white border border-green-200 text-green-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition-all"
              >
                <Share2 size={18} /> {t('calculator.share')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

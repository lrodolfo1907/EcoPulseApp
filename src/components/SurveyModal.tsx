import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, Lightbulb, Target, Users, BarChart3, ChevronRight, GraduationCap, Leaf, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendedSection: string) => void;
}

type RecommendationId = 'training' | 'initiatives' | 'community' | 'calculator';

export function SurveyModal({ isOpen, onClose, onComplete }: SurveyModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0); // 0-4 for questions, 5 for result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    { id: 1, key: 'q1', icon: <Leaf className="text-green-500" /> },
    { id: 2, key: 'q2', icon: <Rocket className="text-blue-500" /> },
    { id: 3, key: 'q3', icon: <BarChart3 className="text-purple-500" /> },
    { id: 4, key: 'q4', icon: <Target className="text-amber-500" /> },
    { id: 5, key: 'q5', icon: <GraduationCap className="text-teal-500" /> }
  ];

  const handleAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [step]: option }));
    if (step < 4) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setStep(5);
      setIsSubmitting(false);
    }, 1200);
  };

  const getRecommendedId = (): RecommendationId => {
    const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
    Object.values(answers).forEach(val => {
      const key = val as string;
      if (key in counts) {
        counts[key]++;
      }
    });

    let maxKey = 'a';
    if (counts.b > counts[maxKey]) maxKey = 'b';
    if (counts.c > counts[maxKey]) maxKey = 'c';
    if (counts.d > counts[maxKey]) maxKey = 'd';
    
    const mapping: Record<string, RecommendationId> = {
      a: 'training',
      b: 'initiatives',
      c: 'community',
      d: 'calculator'
    };
    return mapping[maxKey];
  };

  const recommendation = step === 5 ? getRecommendedId() : null;

  const getRecommendationDetails = (id: RecommendationId | null) => {
    if (!id) return null;
    switch (id) {
      case 'training': return { name: t('survey.result.sections.academy'), icon: <GraduationCap size={48} className="text-amber-500" />, color: 'bg-amber-50 border-amber-200' };
      case 'initiatives': return { name: t('survey.result.sections.initiatives'), icon: <Leaf size={48} className="text-green-500" />, color: 'bg-green-50 border-green-200' };
      case 'community': return { name: t('survey.result.sections.community'), icon: <Users size={48} className="text-blue-500" />, color: 'bg-blue-50 border-blue-200' };
      case 'calculator': return { name: t('survey.result.sections.calculator'), icon: <BarChart3 size={48} className="text-purple-500" />, color: 'bg-purple-50 border-purple-200' };
    }
  };

  const details = getRecommendationDetails(recommendation);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2"
            >
              <X size={20} />
            </button>
            
            {step < 5 ? (
              <motion.div 
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    {questions.map((_, i) => (
                      <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= step ? "bg-green-600" : "bg-gray-100")} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-50 rounded-xl">
                      {questions[step].icon}
                    </div>
                    <p className="text-sm font-bold text-green-600 uppercase tracking-widest">
                      {t('common.loading').replace('...', '')} {step + 1} / 5
                    </p>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight leading-tight">
                    {t(`survey.questions.${questions[step].key}.text`)}
                  </h3>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto mb-6 pr-2">
                  {['a', 'b', 'c', 'd'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={isSubmitting}
                      className="w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 text-left transition-all group flex items-center justify-between"
                    >
                      <span className="font-bold text-gray-700 group-hover:text-green-700">
                        {t(`survey.questions.${questions[step].key}.${option}`)}
                      </span>
                      <ChevronRight className="text-gray-300 group-hover:text-green-500 transform group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors mt-auto"
                  >
                    <ArrowLeft size={16} />
                    {t('common.cancel')}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full mx-auto flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-black mb-2 leading-tight">
                  {t('survey.result.title')}
                </h3>
                <p className="text-gray-500 font-medium mb-8">
                  {t('survey.result.recommendation')}
                </p>

                {details && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={cn("p-8 rounded-[2rem] border-2 mb-8 flex flex-col items-center gap-4 shadow-sm", details.color)}
                  >
                    {details.icon}
                    <span className="text-2xl font-black tracking-tight">{details.name}</span>
                  </motion.div>
                )}

                <button 
                  onClick={() => {
                    const recId = getRecommendedId();
                    onComplete(recId);
                    onClose();
                  }}
                  className="w-full py-5 bg-green-700 text-white rounded-[1.5rem] font-bold hover:bg-green-600 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2 group"
                >
                  {t('survey.result.go', { section: details?.name })}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-all" />
                </button>
              </motion.div>
            )}
            
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[2.5rem]">
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="font-bold text-gray-900 text-xl">Analyzing your profile...</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

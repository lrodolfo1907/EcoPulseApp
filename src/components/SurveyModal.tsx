import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (preferences: string[]) => void;
}

const CATEGORIES = [
  "Waste Reduction",
  "Climate Action",
  "Conservation",
  "Education",
  "Lifestyle",
  "Advocacy"
];

export function SurveyModal({ isOpen, onClose, onComplete }: SurveyModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (category: string) => {
    setSelected(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate backend save
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    onComplete(selected);
    onClose();
  };

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
            className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-bold mb-2 pr-8">Personalize Your Experience</h3>
            <p className="text-gray-500 font-medium mb-8">
              Select the topics you care about most to get customized challenges and initiatives.
            </p>

            <div className="flex-1 overflow-y-auto mb-8 pr-2">
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all border-2",
                      selected.includes(category) 
                        ? "border-green-500 bg-green-50 text-green-700" 
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200"
                    )}
                  >
                    {selected.includes(category) && <CheckCircle2 size={24} />}
                    <span className="font-bold text-sm">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={selected.length === 0 || isSubmitting}
              className="w-full py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving Preferences..." : "Save Preferences"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

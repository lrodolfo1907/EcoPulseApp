import { motion } from "motion/react";
import { BookOpen, ChevronRight } from "lucide-react";

interface TrainingTabProps {
  trainings: any[];
}

export function TrainingTab({ trainings }: TrainingTabProps) {
  return (
    <motion.div
      key="training"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      <div className="max-w-2xl">
        <h2 className="text-3xl font-black tracking-tight">Eco-Academy</h2>
        <p className="text-gray-500 font-medium mt-2">
          Increase your knowledge and capacity to contribute to the community with our curated training sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {trainings.map((course) => (
          <div key={course.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all group">
            <div className="w-full md:w-32 h-32 bg-green-50 rounded-3xl flex items-center justify-center text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all">
              <BookOpen size={40} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                    {course.level}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                    {course.duration}
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-1">{course.title}</h4>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{course.provider}</p>
              </div>
              <button 
                onClick={() => {
                  if (course.url) {
                    window.open(course.url, "_blank");
                  }
                }}
                className="mt-6 flex items-center gap-2 text-green-700 font-bold hover:gap-4 transition-all"
              >
                Start Learning <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

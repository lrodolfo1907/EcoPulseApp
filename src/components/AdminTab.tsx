import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

interface AdminTabProps {
  pendingChallenges: any[];
  handleUpdateChallengeStatus: (id: string, status: string) => void;
}

export function AdminTab({ pendingChallenges, handleUpdateChallengeStatus }: AdminTabProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      key="admin"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-purple-900">{t('admin.title')}</h2>
          <p className="text-gray-500 font-medium">{t('admin.subtitle')}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">{t('admin.pending', { count: pendingChallenges.length })}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {pendingChallenges.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-bold">
              {t('admin.noPending')}
            </div>
          ) : (
            pendingChallenges.map((challenge) => (
              <div key={challenge.id} className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-1">{challenge.title}</h4>
                  {challenge.category && (
                    <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded mb-2">
                      {challenge.category}
                    </span>
                  )}
                  <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {t('admin.suggestedBy', { user: challenge.authorUid })}
                  </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleUpdateChallengeStatus(challenge.id, 'rejected')}
                    className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                  >
                    {t('admin.reject')}
                  </button>
                  <button 
                    onClick={() => handleUpdateChallengeStatus(challenge.id, 'approved')}
                    className="flex-1 md:flex-none px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md"
                  >
                    {t('admin.approve')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

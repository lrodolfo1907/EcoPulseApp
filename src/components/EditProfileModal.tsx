import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  initialBio: string;
  onSaveSuccess: (bio: string) => void;
}

export function EditProfileModal({ isOpen, onClose, user, initialBio, onSaveSuccess }: EditProfileModalProps) {
  const [profileData, setProfileData] = useState({ displayName: '', bio: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setProfileData({
        displayName: user.displayName || '',
        bio: initialBio || ''
      });
    }
  }, [isOpen, user, initialBio]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: profileData.displayName,
        bio: profileData.bio
      });
      onSaveSuccess(profileData.bio);
      onClose();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
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
            className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                  placeholder="Your Name"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bio</label>
                <textarea 
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about your eco-journey..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
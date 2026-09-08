import React, { useState } from 'react';
import { X, Camera, Check, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PRESET_AVATARS = [
  '/assets/founder_harsha_avatar.jpg',
  '/assets/founder_harsha.jpg',
  '/assets/products/hoodie_black.jpg',
  '/assets/products/trench_coat.jpg',
  '/assets/reson/hero_obsidian.jpg',
  '/assets/reson/hero_glacier.jpg',
  '/assets/reson/hero_sage.jpg'
];

const ProfilePhotoModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await updateProfile({
      name,
      avatar: avatarUrl.trim()
    });

    if (res.success) {
      setMessage({ type: 'success', text: 'Profile & photo updated successfully!' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update profile' });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#11141B] border border-[#232A38] text-[#E1E7F0] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#232A38]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#99EEFF]" />
            <h3 className="text-lg font-bold text-white font-display">
              Update Profile & Picture
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8B95A5] hover:text-white rounded-full hover:bg-[#161B24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                : 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Live Photo Preview */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#99EEFF] shadow-cyan-subtle bg-[#161B24] flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/founder_harsha_avatar.jpg';
                }}
              />
            ) : (
              <span className="text-2xl font-bold uppercase text-[#99EEFF] font-display">
                {name ? name.charAt(0) : 'H'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8B95A5] font-mono uppercase tracking-wider">Live Avatar Preview</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Your Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Harsha"
              className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Your Photo (Image URL or Path)
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="/assets/founder_harsha.jpg or paste image link"
              className="w-full px-3.5 py-2.5 text-xs bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-[#8B95A5]/70 mt-1">
              Select one of the brand avatars below or enter any valid image path/URL.
            </p>
          </div>

          {/* Preset Avatar Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2 font-mono">
              Or Choose Brand Preset
            </label>
            <div className="flex gap-2.5 justify-center">
              {PRESET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(preset)}
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                    avatarUrl === preset
                      ? 'border-[#99EEFF] scale-110 ring-2 ring-[#99EEFF]/40 shadow-cyan-subtle'
                      : 'border-[#232A38] opacity-70 hover:opacity-100 hover:border-[#99EEFF]/50'
                  }`}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8B95A5] hover:text-white hover:bg-[#161B24] border border-[#232A38] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#99EEFF] hover:bg-[#B3F2FF] text-black rounded-xl text-xs font-bold uppercase tracking-wider shadow-cyan-subtle transition-all disabled:opacity-50 font-display"
            >
              {saving ? 'Saving...' : 'Save Picture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePhotoModal;


import React from 'react';
import { useApp } from '../context/AppContext';

interface AvatarDisplayProps {
  avatarUrl?: string;
  frameId?: string;
  effectId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showGlow?: boolean;
  className?: string;
  isInteractive?: boolean;
  onClick?: () => void;
  overrideFrame?: any;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarUrl,
  size = 'md',
  showGlow = false,
  className = '',
  isInteractive = false,
  onClick
}) => {
  const { user } = useApp();

  const finalAvatarUrl =
    avatarUrl ||
    user?.avatarUrl ||
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80';

  // Crisp sizing matrix
  const sizeMap = {
    xs: { outer: 'w-6 h-6', ring: 'ring-1' },
    sm: { outer: 'w-8 h-8', ring: 'ring-2' },
    md: { outer: 'w-10 h-10', ring: 'ring-2' },
    lg: { outer: 'w-16 h-16', ring: 'ring-3' },
    xl: { outer: 'w-24 h-24', ring: 'ring-4' },
    '2xl': { outer: 'w-32 h-32', ring: 'ring-4' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${currentSize.outer} ${
        isInteractive ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-all' : ''
      } ${className}`}
    >
      {/* Subtle modern accent ring */}
      <div
        className={`w-full h-full rounded-full overflow-hidden bg-slate-900 border border-purple-500/30 shadow-md ${
          showGlow ? 'shadow-[0_0_12px_rgba(168,85,247,0.35)] ring-2 ring-purple-500/40' : ''
        }`}
      >
        <img
          src={finalAvatarUrl}
          alt="Avatar"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80';
          }}
        />
      </div>
    </div>
  );
};

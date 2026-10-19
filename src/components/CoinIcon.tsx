import React, { useState } from 'react';
import { APP_COIN_URL } from '../constants/branding';
import { Coins } from 'lucide-react';

interface CoinIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

export const CoinIcon: React.FC<CoinIconProps> = ({
  className = '',
  size,
  animate = false
}) => {
  const [hasError, setHasError] = useState(false);

  let defaultSize = 'w-4 h-4';
  if (size === 'xs') defaultSize = 'w-3 h-3';
  else if (size === 'sm') defaultSize = 'w-3.5 h-3.5';
  else if (size === 'md') defaultSize = 'w-4 h-4';
  else if (size === 'lg') defaultSize = 'w-5 h-5';
  else if (size === 'xl') defaultSize = 'w-6 h-6';

  const appliedClass = className || defaultSize;

  // If the direct image URL fails or is blocked by CORS/hotlink protection,
  // render an immersive glowing coin SVG badge with the user's color theme
  if (hasError) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0 ${appliedClass}`}>
        🪙
      </span>
    );
  }

  return (
    <img
      src={APP_COIN_URL}
      alt="Coin"
      onError={() => setHasError(true)}
      className={`inline-block object-cover rounded-full select-none shrink-0 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.8)] bg-amber-500/20 ${
        animate ? 'animate-pulse' : ''
      } ${appliedClass}`}
      loading="eager"
      crossOrigin="anonymous"
    />
  );
};

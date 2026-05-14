'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function PageLoader() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/Search.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load animation:', err));
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-64 h-64">
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
    </div>
  );
}

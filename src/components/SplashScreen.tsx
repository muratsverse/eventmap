import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

const SLOGANS = [
  'Discover Every Moment',
  'Never Miss a Moment',
  'Explore. Discover. Experience.'
];

// Get rotating slogan based on localStorage
const getRotatingSlogan = () => {
  const lastIndex = parseInt(localStorage.getItem('lastSloganIndex') || '0', 10);
  const nextIndex = (lastIndex + 1) % SLOGANS.length;
  localStorage.setItem('lastSloganIndex', nextIndex.toString());
  return SLOGANS[nextIndex];
};

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [slogan] = useState(() => getRotatingSlogan());

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 animate-fade-in">
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 card-shadow">
            <MapPin className="w-24 h-24 text-white mx-auto animate-bounce" strokeWidth={1.5} />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            EventMap
          </h1>
          <p className="text-white/80 text-lg">
            {slogan}
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

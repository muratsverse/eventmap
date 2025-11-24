// Skeleton loader components for better loading states

export function EventCardSkeleton() {
  return (
    <div className="glassmorphism rounded-3xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-white/5" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <div className="h-6 w-24 bg-white/5 rounded-full" />

        {/* Title */}
        <div className="h-6 w-3/4 bg-white/5 rounded-lg" />

        {/* Info rows */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-2/3 bg-white/5 rounded" />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 bg-white/5 rounded-lg" />
          <div className="h-8 w-24 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function EventCardCompactSkeleton() {
  return (
    <div className="glassmorphism rounded-2xl p-4 flex gap-4 animate-pulse">
      {/* Image skeleton */}
      <div className="w-20 h-20 bg-white/5 rounded-xl flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 bg-white/5 rounded" />
        <div className="h-4 w-1/2 bg-white/5 rounded" />
        <div className="h-4 w-2/3 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function MapMarkerSkeleton() {
  return (
    <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Cover photo skeleton */}
      <div className="h-32 bg-white/5" />

      {/* Profile card */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="glassmorphism rounded-3xl p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex-shrink-0" />

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/3 bg-white/5 rounded" />
              <div className="h-4 w-1/2 bg-white/5 rounded" />

              {/* Stats */}
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-5 w-12 bg-white/5 rounded" />
                    <div className="h-3 w-16 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-white/5 rounded" />
          <div className="h-10 w-full bg-white/5 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// Generic skeleton for text
export function TextSkeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-white/5 rounded animate-pulse ${className}`} />;
}

// Generic skeleton for buttons
export function ButtonSkeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-white/5 rounded-xl animate-pulse h-10 ${className}`} />;
}

// Image skeleton with lazy loading support
export function ImageSkeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-white/5 animate-pulse ${className}`} />;
}

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LikeButtonProps {
  projectId?: string;
  initialCount?: number;
  className?: string;
  onLikeChange?: (liked: boolean, count: number) => void;
}

interface Particle {
  id: number;
  tx: string;
  ty: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  projectId,
  initialCount = 24,
  className = "",
  onLikeChange,
}) => {
  const storageKeyLiked = projectId ? `siddhi_liked_${projectId}` : 'siddhi_liked_default';
  const storageKeyCount = projectId ? `siddhi_likes_count_${projectId}` : 'siddhi_likes_count_default';

  const [liked, setLiked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(storageKeyLiked) === 'true';
  });

  const [count, setCount] = useState<number>(() => {
    if (typeof window === 'undefined') return initialCount;
    const stored = localStorage.getItem(storageKeyCount);
    return stored ? parseInt(stored, 10) : initialCount;
  });

  const [isPopping, setIsPopping] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Sync count with Supabase if projectId is provided
  useEffect(() => {
    if (!projectId) return;

    const fetchRealLikes = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('project_likes')
          .select('likes_count')
          .eq('project_id', projectId)
          .maybeSingle();

        if (data && typeof data.likes_count === 'number') {
          setCount(data.likes_count);
          localStorage.setItem(storageKeyCount, String(data.likes_count));
        }
      } catch (err) {
        // Silently use cached/initial count on error
      }
    };

    fetchRealLikes();
  }, [projectId, storageKeyCount]);

  const triggerLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1);
    
    setLiked(newLiked);
    setCount(newCount);

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKeyLiked, String(newLiked));
      localStorage.setItem(storageKeyCount, String(newCount));
    }

    if (onLikeChange) {
      onLikeChange(newLiked, newCount);
    }

    // Persist real count to Supabase if projectId is present
    if (projectId) {
      try {
        await (supabase as any).from('project_likes').upsert(
          {
            project_id: projectId,
            likes_count: newCount,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'project_id' }
        );
      } catch (err) {
        console.warn('Like count persistence notice:', err);
      }
    }

    if (newLiked) {
      // Trigger pop animation
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 300);

      // Spawn 8 particles in a circle
      const numParticles = 8;
      const radius = 32;
      const newParticles: Particle[] = [];

      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * 2 * Math.PI;
        const tx = `${Math.cos(angle) * radius}px`;
        const ty = `${Math.sin(angle) * radius}px`;
        newParticles.push({
          id: Date.now() + i + Math.random(),
          tx,
          ty,
        });
      }

      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={triggerLike}
      className={`like-btn relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer ${
        isPopping ? 'pop' : ''
      } ${liked ? 'liked text-[#FF8A00] border-[#FF8A00]/40' : 'text-muted-foreground'} ${className}`}
      title={liked ? "Unlike Project" : "Like Project"}
    >
      {/* Heart Icon */}
      <svg
        className="heart w-5 h-5 shrink-0"
        viewBox="0 0 24 24"
        fill={liked ? "#FF8A00" : "none"}
        stroke={liked ? "#FF8A00" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      <span className="text-xs font-bold tracking-wide select-none">{count}</span>

      {/* Spawns 8 burst particles on circle each time liked */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={
            {
              top: '50%',
              left: '30%',
              '--tx': p.tx,
              '--ty': p.ty,
            } as React.CSSProperties
          }
        />
      ))}
    </button>
  );
};

export default LikeButton;

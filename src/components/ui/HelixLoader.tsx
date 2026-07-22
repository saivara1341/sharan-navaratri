import React from 'react';

interface HelixLoaderProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export const HelixLoader: React.FC<HelixLoaderProps> = ({
  className = "",
  size,
  style,
  ...props
}) => {
  return (
    <svg
      className={`ld-helix ${className}`.trim()}
      viewBox="0 0 64 32"
      style={{
        ...(size ? { width: size, height: typeof size === 'number' ? size / 2 : `calc(${size} / 2)` } : {}),
        ...style,
      }}
      {...props}
    >
      <path d="M16 16c0-6 4-10 8-10s16 20 24 20 8-4 8-10-4-10-8-10S24 26 16 26 8 22 8 16s4-10 8-10" />
    </svg>
  );
};

export default HelixLoader;

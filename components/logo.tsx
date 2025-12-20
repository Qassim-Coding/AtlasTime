import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40, color = "#f59e0b" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield/Clock Circle Background */}
      <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="1" strokeDasharray="4 2" opacity="0.3" />
      
      {/* Spartan Helmet Profile */}
      <path 
        d="M50 15C35 15 25 25 25 45V60C25 65 28 68 32 68H38V55C38 52 40 50 43 50H57C60 50 62 52 62 55V68H68C72 68 75 65 75 60V45C75 25 65 15 50 15Z" 
        fill={color} 
      />
      
      {/* Eye Slot */}
      <path d="M35 40H45V45H35V40Z" fill="#0f172a" />
      <path d="M55 40H65V45H55V40Z" fill="#0f172a" />
      
      {/* Plume / Clock Markings */}
      <path d="M50 5V15" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M65 8L60 17" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M35 8L40 17" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M78 18L70 24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M22 18L30 24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      
      {/* Nose Guard */}
      <path d="M48 45L50 55L52 45H48Z" fill="#0f172a" />
    </svg>
  );
};

export default Logo;

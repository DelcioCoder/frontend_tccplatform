import React from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface TestimonialCardProps {
  avatarSrc:  StaticImageData;
  avatarAlt: string;
  name: string;
  description: string;
  role: string;
  stars: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  avatarSrc,
  avatarAlt,
  name,
  description,
  role,
  stars,
}) => {
  const renderStars = () => {
    const starIcons = [];
    for (let i = 0; i < 5; i++) {
      starIcons.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < stars ? "currentColor" : "none"}
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
            stroke={i < stars ? "none" : "currentColor"}
            strokeWidth={i < stars ? "none" : "1"}
          />
        </svg>
      );
    }
    return <div className="flex text-yellow-400">{starIcons}</div>;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={avatarSrc}
          alt={avatarAlt}
          className="rounded-full"
          width={50}
          height={50}
        />
        <div>
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{description}</p>
      {renderStars()}
    </div>
  );
};

export default TestimonialCard;
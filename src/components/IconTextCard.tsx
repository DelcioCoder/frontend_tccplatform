import React from 'react';

interface IconTextCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}

const IconTextCard: React.FC<IconTextCardProps> = ({ icon: Icon, text }) => {
  return (
    <div className="flex items-center gap-3">
      <Icon width={24} height={24} stroke="#a7f3d0" className="flex-shrink-0" />
      <p className="text-white font-medium">{text}</p>
    </div>
  );
};

export default IconTextCard;
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ComponentType;
  title: string;
  description: string;
  checks: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, checks }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4" style={{ color: "#2563eb" }}>
        <Icon width={24} height={24} stroke="#2563eb"/>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {checks.map((check, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={16} />
            <span className="text-gray-700">{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureCard;
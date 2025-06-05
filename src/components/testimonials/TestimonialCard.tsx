import React, { useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../../types';
import { buttonHoverAnimation } from '../../utils/animations';
import { formatDistanceToNow } from 'date-fns';

interface TestimonialCardProps {
  testimonial: Testimonial;
  onClick: () => void;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, onClick, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      buttonHoverAnimation(cardRef.current);
    }
  }, []);

  const getFormattedDate = () => {
    if (testimonial.createdAt instanceof Date) {
      return formatDistanceToNow(testimonial.createdAt, { addSuffix: true });
    }
    return 'Recently';
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      className="group relative p-6 bg-white rounded-xl border border-slate-100 hover:border-primary-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-200"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl border-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border-transparent bg-gradient-to-br from-primary-100/30 to-transparent" />

      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate text-slate-800">
            {testimonial.clientName}
          </h3>
          {testimonial.company && (
            <p className="text-sm text-slate-500 truncate">{testimonial.company}</p>
          )}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 transition-colors ${
                i < testimonial.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
        {testimonial.text}
      </p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400 italic">{getFormattedDate()}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
import React, { useEffect, useRef } from 'react';
import { X, Star, ExternalLink } from 'lucide-react';
import { Testimonial } from '../../types';
import { fadeIn } from '../../utils/animations';

interface TestimonialModalProps {
  testimonial: Testimonial;
  onClose: () => void;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ testimonial , onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (modalRef.current && backdropRef.current) {
      fadeIn(backdropRef.current);
      fadeIn(modalRef.current);
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Format date
  const formattedDate = testimonial.createdAt instanceof Date 
    ? new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(testimonial.createdAt)
    : 'Recent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg w-full max-w-lg z-10 overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Client Testimonial</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold">{testimonial.clientName}</h4>
              {testimonial.company && (
                <p className="text-slate-600">{testimonial.company}</p>
              )}
              
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-6 prose prose-slate max-w-none">
            <p className="whitespace-pre-line">{testimonial.text}</p>
          </div>

          {testimonial.url && (
            <div className="flex items-center space-x-2">
              <a 
                href={testimonial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <span>Visit site / socials</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          
          <div className="text-sm text-slate-500">
            Received on {formattedDate}
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="btn-outline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialModal;
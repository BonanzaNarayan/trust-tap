import React, { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { formFieldFocusAnimation, slideUp } from '../../utils/animations';
import toast from 'react-hot-toast';

interface TestimonialFormProps {
  formId: string;
  formTitle?: string;
  formDescription?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

interface FormData {
  clientName: string;
  company: string;
  rating: number;
  url: string;
  text: string;
  videoFile?: File | null;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  formTitle = 'Share Your Experience',
  formDescription = 'We value your feedback! Please share your experience with our product/service.',
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    company: '',
    rating: 0,
    url: '',
    text: '',
    videoFile: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  // const [fileName, setFileName] = useState<string>('');
  
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (formRef.current) {
      slideUp(formRef.current);
    }
    
    if (nameInputRef.current) {
      formFieldFocusAnimation(nameInputRef.current);
    }
    
    if (companyInputRef.current) {
      formFieldFocusAnimation(companyInputRef.current);
    }
    
    if (textareaRef.current) {
      formFieldFocusAnimation(textareaRef.current);
    }
    if (urlInputRef.current) {
      formFieldFocusAnimation(urlInputRef.current);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
    
  //   if (file) {
  //     // Check file size (max 100MB)
  //     if (file.size > 100 * 1024 * 1024) {
  //       setErrors(prev => ({ 
  //         ...prev, 
  //         videoFile: 'Video must be smaller than 100MB' 
  //       }));
  //       return;
  //     }
      
  //     setFormData(prev => ({ ...prev, videoFile: file }));
  //     setFileName(file.name);
      
  //     // Clear error
  //     if (errors.videoFile) {
  //       setErrors(prev => {
  //         const newErrors = { ...prev };
  //         delete newErrors.videoFile;
  //         return newErrors;
  //       });
  //     }
  //   }
  // };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    
    // Clear error
    if (errors.rating) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.rating;
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (formData.company && formData.company.trim().length > 100) {
      newErrors.company = 'Company name must be less than 100 characters';
    }
    if (formData.url && formData.url.trim().length > 100) {
      newErrors.url = 'Company name must be less than 100 characters';
    }
    
    if (!formData.text.trim()) {
      newErrors.text = 'Testimonial is required';
    } else if (formData.text.trim().length < 50) {
      newErrors.text = 'Testimonial must be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      await onSubmit({
        ...formData,
      });
      
      // Reset form after successful submission
      setFormData({
        clientName: '',
        company: '',
        rating: 0,
        url: '',
        text: '',
        // videoFile: null
      });
      // setFileName('');
      
      toast.success('Thank you for your testimonial!');
    } catch (error) {
      toast.error('Failed to submit testimonial. Please try again.');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{formTitle}</h2>
        <p className="mt-2 text-slate-600">{formDescription}</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="clientName" className="label">
          Your Name *
        </label>
        <input
          ref={nameInputRef}
          id="clientName"
          name="clientName"
          type="text"
          value={formData.clientName}
          onChange={handleChange}
          className={`input ${errors.clientName ? 'border-error-500 focus:ring-error-500' : ''}`}
          placeholder="John Doe"
        />
        {errors.clientName && <p className="text-error-500 text-sm mt-1">{errors.clientName}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="company" className="label">
          Company (Optional)
        </label>
        <input
          ref={companyInputRef}
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          className="input"
          placeholder="Acme Inc."
        />
      </div>
      
      <div className="form-group">
        <label className="label">
          Rating *
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              className="text-2xl focus:outline-none transition-all"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredStar || formData.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-error-500 text-sm mt-1">{errors.rating}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="text" className="label">
          Your Testimonial *
        </label>
        <textarea
          ref={textareaRef}
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          className={`textarea ${errors.text ? 'border-error-500 focus:ring-error-500' : ''}`}
          placeholder="Please share your experience with us (minimum 50 characters)"
          rows={5}
        ></textarea>
        <div className="flex justify-between mt-1">
          {errors.text ? (
            <p className="text-error-500 text-sm">{errors.text}</p>
          ) : (
            <p className="text-slate-500 text-sm">
              {formData.text.length < 50 
                ? `${50 - formData.text.length} more characters needed` 
                : `${formData.text.length} characters`}
            </p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="company" className="label">
          Link (Optional)
        </label>
        <input
          ref={urlInputRef}
          id="url"
          name="url"
          type="text"
          value={formData.url}
          onChange={handleChange}
          className="input"
          placeholder="website or social media link"
        />
      </div>
      
      {/* <div className="form-group">
        <label className="label">
          Video Testimonial (Optional)
        </label>
        <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <Upload className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm text-slate-600">
              {fileName ? (
                <span className="font-medium text-primary-600">{fileName}</span>
              ) : (
                <>
                  Drag and drop a video file here, or <span className="text-primary-600">browse</span>
                  <br />
                  <span className="text-xs">Max file size: 100MB</span>
                </>
              )}
            </p>
          </div>
        </div>
        {errors.videoFile && <p className="text-error-500 text-sm mt-1">{errors.videoFile}</p>}
      </div> */}
      
      <button
        type="submit"
        className="btn-primary w-full py-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
              <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit Testimonial'
        )}
      </button>
    </form>
  );
};

export default TestimonialForm;
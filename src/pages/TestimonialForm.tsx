import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CheckCircle } from 'lucide-react';
import TestimonialFormComponent from '../components/forms/TestimonialForm';
import toast from 'react-hot-toast';

const TestimonialFormPage: React.FC = () => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    userId: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFormData = async () => {
      if (!formId) {
        navigate('/');
        return;
      }
      
      try {
        const formDoc = await getDoc(doc(db, 'forms', formId));
        
        if (!formDoc.exists()) {
          toast.error('Form not found');
          navigate('/');
          return;
        }
        
        const data = formDoc.data();
        setFormData({
          title: data.title,
          description: data.description,
          userId: data.userId
        });
      } catch (error) {
        console.error('Error fetching form:', error);
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFormData();
  }, [formId, navigate]);

  const handleSubmit = async (data: any) => {
    if (!formId || !formData) return;
    
    setIsSubmitting(true);
    
    try {
      
      // Upload video if exists
      
      // Add testimonial to Firestore
      await addDoc(collection(db, 'testimonials'), {
        clientName: data.clientName,
        company: data.company,
        rating: data.rating,
        text: data.text,
        url: data.url,
        formId,
        userId: formData.userId,
        createdAt: serverTimestamp()
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Thank You!</h2>
          <p className="text-slate-600 mb-6">
            Your testimonial has been submitted successfully. We appreciate your feedback!
          </p>
          <button
            onClick={() => window.close()}
            className="btn-primary w-full"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
        <TestimonialFormComponent
          formId={formId || ''}
          formTitle={formData?.title}
          formDescription={formData?.description}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default TestimonialFormPage;
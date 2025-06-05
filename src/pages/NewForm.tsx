import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { formFieldFocusAnimation } from '../utils/animations';
import toast from 'react-hot-toast';

const NewForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Form title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'forms'), {
        title: formData.title,
        description: formData.description,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        active: true
      });
      
      toast.success('Form created successfully!');
      navigate(`/dashboard/forms`);
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form');
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    
    if (titleInput) {
      formFieldFocusAnimation(titleInput as HTMLElement);
    }
    
    if (descriptionInput) {
      formFieldFocusAnimation(descriptionInput as HTMLElement);
    }
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Create Collection Form" subtitle="Create a new testimonial collection form" />
      
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Form Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="label">
                  Form Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Client Feedback Form"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="label">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="e.g., We value your feedback! Please share your experience with our service."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/forms')}
                  className="btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Form'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewForm;
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { TestimonialForm } from '../../types';
import { Link } from 'react-router-dom';
import { Link2, Copy, BarChart3, Edit, Trash, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const FormsList: React.FC = () => {
  const [forms, setForms] = useState<TestimonialForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchForms = async () => {
      if (!currentUser) return;
      
      try {
        const formsRef = collection(db, 'forms');
        const formQuery = query(
          formsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(formQuery);
        
        const results: TestimonialForm[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          results.push({
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            active: data.active
          });
        });
        
        setForms(results);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchForms();
  }, [currentUser]);

  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}/testimonial/form/${formId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  // delete form form firebase
  const handleDeleteForm = async (formId: string) => {
    if (!currentUser) return;
    
    try {
      const formRef = doc(db, 'forms', formId);
      await deleteDoc(formRef);
      setForms(forms.filter(form => form.id !== formId));
      toast.success('Form deleted successfully!');
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form. Please try again.');
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Collection Forms" subtitle="Create and manage your testimonial collection forms" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Forms</h2>
          <Link to="/dashboard/forms/new" className="btn-primary">
            Create New Form
          </Link>
        </div>
        
        {/* Forms List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 w-72 bg-slate-200 rounded mb-3"></div>
                    <div className="flex items-center">
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-8 w-8 bg-slate-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : forms.length > 0 ? (
          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form.id} className="card hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{form.title}</h3>
                    <p className="text-slate-600 mb-2">{form.description || 'No description'}</p>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="mr-3">
                        Created: {new Intl.DateTimeFormat('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }).format(form.createdAt)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        form.active 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => copyFormLink(form.id)}
                      className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="Copy shareable link"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                    </button>
                    <Link
                      to={`/dashboard/forms/${form.id}/responses`}
                      className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="View responses"
                    >
                      <BarChart3 className="w-4 h-4 text-slate-600" />
                    </Link>
                    <Link
                      to={`/testimonial/form/${form.id}`}
                      target="_blank"
                      className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="Preview form"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </Link>
                    {/* <Link
                      to={`/dashboard/forms/${form.id}/edit`}
                      className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="Edit form"
                    >
                      <Edit className="w-4 h-4 text-slate-600" />
                    </Link> */}
                    <button
                      onClick={() => handleDeleteForm(form.id)}

                      className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="Delete form"
                    >
                      <Trash className="w-4 h-4 text-error-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No forms yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first testimonial collection form to start gathering feedback from your clients.
            </p>
            <Link to="/dashboard/forms/new" className="btn-primary">
              Create Collection Form
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsList;
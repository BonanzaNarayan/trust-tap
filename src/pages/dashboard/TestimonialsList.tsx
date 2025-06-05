import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import TestimonialCard from '../../components/testimonials/TestimonialCard';
import TestimonialModal from '../../components/testimonials/TestimonialModal';
import { Testimonial } from '../../types';
import { Grid, List, Filter, SortAsc, SortDesc } from 'lucide-react';

const TestimonialsList: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showRate, setShowRate] = useState(false);
  
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!currentUser) return;
      
      try {
        const testimonialsRef = collection(db, 'testimonials');
        let testimonialQuery = query(
          testimonialsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', sortOrder)
        );
        
        const querySnapshot = await getDocs(testimonialQuery);
        
        let results: Testimonial[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          results.push({
            id: doc.id,
            clientName: data.clientName,
            company: data.company,
            rating: data.rating,
            text: data.text,
            url: data.url,
            createdAt: data.createdAt.toDate(),
            userId: data.userId,
            formId: data.formId
          });
        });
        
        // Apply rating filter if set
        if (filterRating !== null) {
          results = results.filter(testimonial => testimonial.rating === filterRating);
        }
        
        setTestimonials(results);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
  }, [currentUser, sortOrder, filterRating]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };
  
  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating === filterRating ? null : rating);
  };

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Testimonials" subtitle="Manage all your client testimonials" />
      
      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleViewMode}
                className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
              >
                {viewMode === 'grid' ? (
                  <List className="w-5 h-5 text-slate-600" />
                ) : (
                  <Grid className="w-5 h-5 text-slate-600" />
                )}
              </button>
              
              <button 
                onClick={toggleSortOrder}
                className="p-2 rounded-md border border-slate-300 hover:bg-slate-50"
              >
                {sortOrder === 'desc' ? (
                  <SortDesc className="w-5 h-5 text-slate-600" />
                ) : (
                  <SortAsc className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowRate(!showRate)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
              >
                <Filter className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Filter</span>
              </button>
              {
                showRate && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 p-4 z-10 min-w-[200px]">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Rating</h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`rating-${rating}`}
                            checked={filterRating === rating}
                            onChange={() => handleFilterChange(rating)}
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                          />
                          <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-slate-600">
                            {rating} {rating === 1 ? 'Star' : 'Stars'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          
          <div>
            <p className="text-sm text-slate-600">
              {testimonials.length} {testimonials.length === 1 ? 'testimonial' : 'testimonials'}
              {filterRating !== null && ` with ${filterRating} ${filterRating === 1 ? 'star' : 'stars'}`}
            </p>
          </div>
        </div>
        
        {/* Testimonials List */}
        {isLoading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="h-5 w-32 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-slate-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No testimonials found</h3>
            <p className="text-slate-600">
              {filterRating !== null 
                ? `No testimonials with ${filterRating} ${filterRating === 1 ? 'star' : 'stars'} rating found.` 
                : 'Create a testimonial collection form to start gathering feedback from your clients.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Testimonial Modal */}
      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
    </div>
  );
};

export default TestimonialsList;
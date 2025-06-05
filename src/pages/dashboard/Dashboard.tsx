import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import TestimonialCard from '../../components/testimonials/TestimonialCard';
import TestimonialModal from '../../components/testimonials/TestimonialModal';
import { Testimonial, TestimonialStats } from '../../types';
import { MessageSquare, BarChart3, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<TestimonialStats>({
    total: 0,
    averageRating: 0,
    recentCount: 0
  });
  const [recentTestimonials, setRecentTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      try {
        // Get testimonials collection reference
        const testimonialsRef = collection(db, 'testimonials');
        
        // Query for user's testimonials
        const userTestimonialsQuery = query(
          testimonialsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(userTestimonialsQuery);
        
        // Calculate stats
        let totalRating = 0;
        const oneMonthAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        let recentCount = 0;
        
        const testimonials: Testimonial[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const testimonial = {
            id: doc.id,
            clientName: data.clientName,
            company: data.company,
            rating: data.rating,
            text: data.text,
            url: data.url,
            createdAt: data.createdAt.toDate(),
            userId: data.userId,
            formId: data.formId
          };
          
          testimonials.push(testimonial);
          totalRating += testimonial.rating;
          
          if (data.createdAt >= oneMonthAgo) {
            recentCount++;
          }
        });
        
        // Recent testimonials
        const recent = testimonials.slice(0, 3);
        
        setRecentTestimonials(recent);
        setStats({
          total: testimonials.length,
          averageRating: testimonials.length > 0 ? parseFloat((totalRating / testimonials.length).toFixed(1)) : 0,
          recentCount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Dashboard" subtitle="Welcome back!" />
      
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Testimonials"
            value={stats.total}
            icon={<MessageSquare className="w-5 h-5 text-primary-600" />}
            bgColor="bg-primary-50"
          />
          <StatsCard
            title="Average Rating"
            value={stats.averageRating}
            icon={<Star className="w-5 h-5 text-yellow-600" />}
            bgColor="bg-yellow-50"
          />
          <StatsCard
            title="Last 30 Days"
            value={stats.recentCount}
            change={10}
            icon={<BarChart3 className="w-5 h-5 text-secondary-600" />}
            bgColor="bg-secondary-50"
          />
          <StatsCard
            title="Active Forms"
            value={2}
            icon={<Users className="w-5 h-5 text-accent-600" />}
            bgColor="bg-accent-50"
          />
        </div>
        
        {/* Recent Testimonials */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Testimonials</h2>
            <Link to="/dashboard/testimonials" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
          ) : recentTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTestimonials.map((testimonial, index) => (
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
              <h3 className="text-lg font-medium text-slate-900 mb-2">No testimonials yet</h3>
              <p className="text-slate-600 mb-6">
                Create your first testimonial collection form to start gathering feedback from your clients.
              </p>
              <Link to="/dashboard/forms/new" className="btn-primary">
                Create Collection Form
              </Link>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/dashboard/forms/new" className="card hover:shadow-md transition-all text-center p-8">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create Collection Form</h3>
              <p className="text-slate-600">Generate a new testimonial collection form</p>
            </Link>
            
            <Link to="/dashboard/testimonials" className="card hover:shadow-md transition-all text-center p-8">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">View Testimonials</h3>
              <p className="text-slate-600">Browse and manage all your testimonials</p>
            </Link>
            
            <Link to="/dashboard/analytics" className="card hover:shadow-md transition-all text-center p-8">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Analytics</h3>
              <p className="text-slate-600">See detailed performance metrics</p>
            </Link>
          </div>
        </div>
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

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Calendar, Filter, Download } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [submissionData, setSubmissionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentUser) return;

      try {
        const testimonialsRef = collection(db, 'testimonials');
        const userTestimonialsQuery = query(
          testimonialsRef,
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(userTestimonialsQuery);
        const testimonials = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));

        setSubmissionData(testimonials);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser]);

  const getDaysArray = () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const getSubmissionsByDay = () => {
    const days = getDaysArray();
    const submissionsByDay = days.map(day => {
      const count = submissionData.filter(submission => 
        format(submission.createdAt, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length;
      return {
        date: format(day, 'MMM dd'),
        count
      };
    });

    return submissionsByDay;
  };

  const submissionTrend = {
    labels: getSubmissionsByDay().map(day => day.date),
    datasets: [
      {
        label: 'Submissions',
        data: getSubmissionsByDay().map(day => day.count),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const ratingDistribution = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        data: [1, 2, 3, 8, 15],
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981',
          '#3B82F6',
          '#6366F1'
        ]
      }
    ]
  };

  const deviceDistribution = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [45, 40, 15],
        backgroundColor: [
          'rgb(79, 70, 229)',
          'rgb(168, 85, 247)',
          'rgb(52, 211, 153)'
        ]
      }
    ]
  };

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Analytics" subtitle="Track your testimonial collection performance" />
      
      <div className="p-6">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
                className="text-sm text-slate-600 bg-transparent border-none focus:ring-0"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            
            <button className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-2 text-sm text-slate-600">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-2 text-sm text-slate-600">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Total Submissions</h3>
                <p className="text-2xl font-semibold">{submissionData.length}</p>
              </div>
              
              <div className="card">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Completion Rate</h3>
                <p className="text-2xl font-semibold">87%</p>
              </div>
              
              <div className="card">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Avg. Time to Complete</h3>
                <p className="text-2xl font-semibold">2m 34s</p>
              </div>
              
              <div className="card">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Active Forms</h3>
                <p className="text-2xl font-semibold">5</p>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Submission Trend</h3>
                <div className="h-[300px]">
                  <Line
                    data={submissionTrend}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
                  <div className="h-[300px] flex items-center justify-center">
                    <Pie
                      data={ratingDistribution}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
                  <div className="h-[300px] flex items-center justify-center">
                    <Pie
                      data={deviceDistribution}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { formFieldFocusAnimation } from '../../utils/animations';
import toast from 'react-hot-toast';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => Promise<void>;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (emailInputRef.current) {
      formFieldFocusAnimation(emailInputRef.current);
    }
    if (passwordInputRef.current) {
      formFieldFocusAnimation(passwordInputRef.current);
    }
    if (nameInputRef.current && type === 'signup') {
      formFieldFocusAnimation(nameInputRef.current);
    }
  }, [type]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (type === 'signup' && !name) {
      newErrors.name = 'Name is required';
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
      await onSubmit({ email, password, ...(type === 'signup' ? { name } : {}) });
      
      // Clear form after successful submission
      setEmail('');
      setPassword('');
      setName('');
      setErrors({});
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'signup' && (
        <div className="form-group">
          <label htmlFor="name\" className="label">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              ref={nameInputRef}
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input pl-10 ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="text-error-500 text-sm mt-1">{errors.name}</p>}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="email" className="label">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            ref={emailInputRef}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="your@email.com"
          />
        </div>
        {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password" className="label">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            ref={passwordInputRef}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`input pl-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder={type === 'signup' ? 'Create a password' : 'Enter your password'}
          />
        </div>
        {errors.password && <p className="text-error-500 text-sm mt-1">{errors.password}</p>}
      </div>
      
      {type === 'login' && (
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
            Forgot password?
          </Link>
        </div>
      )}
      
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
              <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {type === 'login' ? 'Signing In...' : 'Creating Account...'}
          </span>
        ) : (
          <>{type === 'login' ? 'Sign In' : 'Create Account'}</>
        )}
      </button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-slate-600">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link to="/signup\" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default AuthForm;
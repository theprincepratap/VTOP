"use client";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

export default function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  message,
  handleFormSubmit,
  progressBar,
}) {
  const isLoading = message.startsWith("Logging");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 relative overflow-hidden" style={{ backgroundColor: '#141D38' }} suppressHydrationWarning>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#FCDB32' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#FCDB32' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: '#FCDB32' }}></div>
      </div>

      {/* Logo/App name with accent */}
      <div className="relative z-10 mb-12 text-center" suppressHydrationWarning>
        <div className="inline-block">
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#FCDB32' }}>
            VTOP
          </h1>
          <div className="h-1 rounded-full mx-auto" style={{ width: '60%', backgroundColor: '#FCDB32' }}></div>
        </div>
        <p className="text-gray-300 mt-3 text-sm">Student Portal Access</p>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="relative z-10 rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(20, 29, 56, 0.8)',
          border: '1px solid rgba(252, 219, 50, 0.2)'
        }}
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        {/* Username Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: '#FCDB32' }} />
            Username
          </label>
          <input
            className="w-full border p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(252, 219, 50, 0.3)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FCDB32';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(252, 219, 50, 0.3)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Lock className="w-4 h-4" style={{ color: '#FCDB32' }} />
            Password
          </label>
          <div className="relative">
            <input
              className="w-full border p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(252, 219, 50, 0.3)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FCDB32';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(252, 219, 50, 0.3)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 rounded-md p-2 top-1/2 transform -translate-y-1/2 hover:bg-white/10 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {!isLoading && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] mt-8"
            style={{ 
              backgroundColor: '#FCDB32',
              color: '#141D38',
              boxShadow: '0 4px 20px rgba(252, 219, 50, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fde464';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(252, 219, 50, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FCDB32';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(252, 219, 50, 0.3)';
            }}
          >
            Sign In
          </button>
        )}

        {message && (
          <div className="flex flex-col items-center justify-center gap-4 text-sm mt-6">
            {/* Animated Loader */}
            <div className="relative w-20 h-20">
              {/* Outer rotating ring */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                style={{ 
                  borderTopColor: '#FCDB32',
                  borderRightColor: '#FCDB32',
                  animationDuration: '1s'
                }}
              ></div>
              
              {/* Inner pulsing circle */}
              <div 
                className="absolute inset-2 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: 'rgba(252, 219, 50, 0.2)',
                  boxShadow: '0 0 20px rgba(252, 219, 50, 0.4)'
                }}
              ></div>
              
              {/* Center dot */}
              <div 
                className="absolute inset-6 rounded-full"
                style={{ 
                  backgroundColor: '#FCDB32',
                  boxShadow: '0 0 15px rgba(252, 219, 50, 0.8)'
                }}
              ></div>
              
              {/* Orbiting dots */}
              <div 
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: '2s', animationDirection: 'reverse' }}
              >
                <div 
                  className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full"
                  style={{ backgroundColor: '#FCDB32' }}
                ></div>
                <div 
                  className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 rounded-full"
                  style={{ backgroundColor: '#FCDB32' }}
                ></div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden backdrop-blur-sm relative">
              <div
                className="h-2.5 transition-all duration-500 ease-in-out rounded-full relative overflow-hidden"
                style={{ 
                  width: `${progressBar}%`,
                  backgroundColor: '#FCDB32',
                  boxShadow: '0 0 10px rgba(252, 219, 50, 0.5)'
                }}
              >
                {/* Shimmer effect */}
                <div 
                  className="absolute inset-0 animate-shimmer"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite'
                  }}
                ></div>
              </div>
            </div>

            {/* Status Message with typing effect */}
            <div className="min-h-[40px] flex items-center justify-center">
              <span className="whitespace-pre-wrap text-gray-300 text-center font-medium animate-pulse">
                {message}
              </span>
            </div>

            {/* Loading dots animation */}
            <div className="flex gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: '#FCDB32',
                  animationDelay: '0ms'
                }}
              ></div>
              <div 
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: '#FCDB32',
                  animationDelay: '150ms'
                }}
              ></div>
              <div 
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: '#FCDB32',
                  animationDelay: '300ms'
                }}
              ></div>
            </div>
          </div>
        )}
      </form>

      {/* Footer text */}
      <p className="relative z-10 mt-8 text-gray-400 text-sm">
        Secure login powered by VTOP
      </p>
    </div>
  );
}

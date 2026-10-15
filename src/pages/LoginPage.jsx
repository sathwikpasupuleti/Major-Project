import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const success = login(email.trim(), password, rememberMe);

    if (success) {
      navigate('/home');
    } else {
      setError(authError || 'Unable to sign in. Check your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#101018] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        {/* Ragaa logo */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-15 h-15 w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Music2 className="w-8 h-8 text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-wide text-white">
              RAGAA
            </h1>
            <p className="text-sm text-purple-400">
              Every mood. Every beat.
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-[30px] border border-purple-900/60 bg-[#1B1C2E] p-7 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white">
              Welcome Back
            </h2>

            <p className="text-sm text-zinc-400 mt-2">
              Sign in to continue listening to Telugu, Hindi, Tamil & English hits
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-zinc-200 mb-2"
              >
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-purple-900/60 bg-[#101018] px-4">
                <Mail className="w-5 h-5 text-purple-400 shrink-0" />

                <input
                  id="email"
                  name="ragaa-login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-zinc-200"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-purple-900/60 bg-[#101018] px-4">
                <Lock className="w-5 h-5 text-purple-400 shrink-0" />

                <input
                  id="password"
                  name="ragaa-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-zinc-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="w-5 h-5 accent-purple-500"
              />

              <span className="text-sm text-zinc-300">
                Remember me on this browser
              </span>
            </label>

            {/* Error message */}
            {(error || authError) && (
              <p role="alert" className="text-sm text-red-400 mb-4">
                {error || authError}
              </p>
            )}

            {/* Sign in */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] py-4 font-bold text-white shadow-lg shadow-purple-600/20 transition hover:from-[#7C3AED] hover:to-[#9333EA] flex items-center justify-center gap-3"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="border-t border-purple-900/40 mt-8 pt-7 text-center">
            <p className="text-sm text-zinc-400">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-semibold text-purple-400 hover:text-purple-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

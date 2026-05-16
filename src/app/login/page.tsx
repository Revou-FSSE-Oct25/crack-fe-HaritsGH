'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition, useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { loginAction } from './action'
import { LoginProps } from '@/lib/props'
import { useUser } from '@/app/context/UserContext'

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginProps>()
  const [isPending, startTransition] = useTransition()
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const { setUserInfo, userId } = useUser()

  useEffect(() => {
    if (userId) {
      router.push('/dashboard')
    }
  }, [userId, router])

  const onSubmit = (data: LoginProps) => {
    setLoginError(null)
    startTransition(async () => {
      try {
        const result = await loginAction(data)
        if (result?.error) {
          setLoginError(result.error)
        } else if (result?.userId && result?.username) {
          setUserInfo(result.userId, result.username)
        }
      } catch (error) {
        setLoginError('An unexpected error occurred')
      }
    })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  {...register('username', { required: true })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
                {errors.username && <p className='text-red-600 text-sm mt-1'>Username is required</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', { required: true })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
                {errors.password && <p className='text-red-600 text-sm mt-1'>Password is required</p>}
              </div>

              <button
                type='submit'
                disabled={isPending}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href={'/register'} className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage

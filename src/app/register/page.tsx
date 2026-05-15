'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useTransition, useState } from 'react'
import { registerAction } from './action'
import { RegisterProps } from '@/lib/props'

function RegisterPage() {
  // di backend nya handle race condition biar id gak dobel yg harusnya uniq
  const { register, formState: { errors }, handleSubmit } = useForm<RegisterProps>()
  const [isPending, startTransition] = useTransition()
  const [registerError, setRegisterError] = useState<string | null>(null)
  const onSubmit = async (data: RegisterProps) => {
    setRegisterError(null)
    startTransition(async () => {
      const result = await registerAction(data)
      if (result?.error) {
        setRegisterError(result.error)
      }
    })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Create Account</h2>
            
            {registerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {registerError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input 
                  type="text" 
                  placeholder="Choose a username" 
                  {...register('username', { required: true })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
                {errors.username && <p className='text-red-600 text-sm mt-1'>Username is required</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...register('email', { required: true })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
                {errors.email && <p className='text-red-600 text-sm mt-1'>Email is required</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="Create a password" 
                  {...register('password', { required: true })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
                {errors.password && <p className='text-red-600 text-sm mt-1'>Password is required</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm your password" 
                  {...register('confirmPassword', { required: true })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
                {errors.confirmPassword && <p className='text-red-600 text-sm mt-1'>Confirm Password is required</p>}
              </div>

              <button 
                type='submit' 
                disabled={isPending}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href={'/login'} className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

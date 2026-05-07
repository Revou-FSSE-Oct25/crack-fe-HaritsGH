import Header from '@/components/Header'
import Link from 'next/link'
import React from 'react'

function LoginPage() {
  return (
    <>
      <Header/>
      <h2>Login</h2>
      <form className='flex flex-col'>
        <label htmlFor='uname'>
          Username
        </label>
        <input
          type='text'
          id='uname'
          name='username'
          className='border-1'
        />

        <label htmlFor='pwd'>
          Password
        </label>
        <input
          type='password'
          id='pwd'
          name='pw'
          className='border-1'
        />

        <button type='submit' className='border-1'>
          Login
        </button>
        <Link href={'/register'}>Register</Link>
      </form>
    </>
  )
}

export default LoginPage

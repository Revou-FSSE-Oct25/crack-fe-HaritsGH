import Header from '@/components/Header'
import Link from 'next/link'
import React from 'react'

function RegisterPage() {
  // di backend nya handle race condition biar id gak dobel yg harusnya uniq
  return (
    <>
      <Header/>
      <h2>Register</h2>
      <form className='flex flex-col'>
        <label htmlFor='email'>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='usermail'
          className='border-1'
        />

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
          name='userpw'
          className='border-1'
        />

        <label htmlFor='pwd2'>
          Re-enter Password
        </label>
        <input
          type='password'
          id='pwd2'
          name='userpw2'
          className='border-1'
        />

        <button type='submit'>
          Register
        </button>
      </form>
      <Link href={'login'}>Login</Link>
    </>
  )
}

export default RegisterPage

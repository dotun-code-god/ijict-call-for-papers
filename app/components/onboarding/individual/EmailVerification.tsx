import React from 'react'

const EmailVerification = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Pending Verification</h1>
        <p className="mt-4 text-lg">Your account is pending verification. Please check your email for further instructions.</p>
    </div>
  )
}

export default EmailVerification
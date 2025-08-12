import { BASE_URL } from '@/constants'
import Link from 'next/link'
import React from 'react'

const FellowshipNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Fellowship not found</h1>
        <p className="mt-4 text-lg">Please check the fellowship link and try again.</p>
        <Link href={BASE_URL}>Go to Home</Link>
    </div>
  )
}

export default FellowshipNotFound
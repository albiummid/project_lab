import Image from 'next/image'
import React from 'react'

export default function Img({ src, className }) {
  return (
    <div
    // className={` ${className}`}
    >
      <Image
        src={src}
        className={className}
        // width={100}
        // height={100}
        // layout='fill'
        alt=''
      />
    </div>
  )
}

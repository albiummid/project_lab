import React from 'react'

export default function Spinner({ className }) {
  return (
    <div className={`w-10 ${className}`}>
      <div className={`lds-roller w-full h-full`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

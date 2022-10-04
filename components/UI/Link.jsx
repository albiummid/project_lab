import React from 'react'
import Link from 'next/link'

export default function Redirect({ to, className, children, ...rest }) {
  return (
    <Link href={to} {...rest}>
      <a className={className}>{children}</a>
    </Link>
  )
}

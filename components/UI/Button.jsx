import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
export default function Button({ children, className, loading, ...rest }) {
  const antIcon = (
    <LoadingOutlined
      className='float-left'
      style={{
        fontSize: 20,
      }}
      spin
    />
  )
  return (
    <button
      {...rest}
      className={`border w-full px-4 py-1 mx-auto mt-4 rounded-md active:opacity-70   ${className} ${
        loading && 'opacity-70'
      }`}
    >
      {loading && <Spin className='float-left' indicator={antIcon} />}
      <span>{children}</span>
    </button>
  )
}

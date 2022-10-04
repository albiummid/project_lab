import React, { useState } from 'react'
import { Popover } from 'antd'

const colors = {
  red: {
    color: 'red',
    class: 'bg-red-400',
  },
  green: {
    color: 'green',
    class: 'bg-green-400',
  },
  blue: {
    color: 'blue',
    class: 'bg-blue-400',
  },
  indigo: {
    color: 'indigo',
    class: 'bg-indigo-400',
  },
  sky: {
    color: 'sky',
    class: 'bg-sky-400',
  },
  purple: {
    color: 'purple',
    class: 'bg-purple-400',
  },
  violet: {
    color: 'violet',
    class: 'bg-violet-400',
  },
}

export default function ColorPalette({ onChange, defaultValue }) {
  const [activeColor, setActiveColor] = useState(
    defaultValue || Object.keys(colors)[0]
  )

  return (
    <div className='bg-white/60 w-full flex items-center space-x-1'>
      {Object.keys(colors).map((key) => {
        let item = colors[key]
        return (
          <Popover content={<span>{key}</span>} key={key}>
            <div
              onClick={() => {
                setActiveColor(key)
                onChange(key)
              }}
              className={` border-2 duration-300 ${
                activeColor === key ? 'border-gray-800/80' : 'border-white'
              }  rounded-full md:h-6 md:w-6 h-4 w-4 cursor-pointer ${
                item.class
              }`}
              key={key}
            />
          </Popover>
        )
      })}
    </div>
  )
}

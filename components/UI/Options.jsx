import React, { useRef, useState } from 'react'
import { ThreeDotIcon } from '../../assets'
import { useClickAway } from 'react-use'
import { Dropdown, Menu } from 'antd'
import { TbIcons } from 'react-icons/tb'

export default function Options({
  options = [
    {
      title: 'Demo Title',
      icon: <TbIcons />,
    },
  ],
  onChange = () => {},
}) {
  const optionRef = useRef(null)
  useClickAway(optionRef, () => {
    setActive(false)
  })

  let menuItems = options.map(
    ({ title, icon, action = () => {}, ...rest }, key) => {
      return {
        key,
        label: (
          <div
            onClick={() => {
              onChange(title)
              action()
            }}
            className='flex items-center justify-between space-x-4'
          >
            <span className=''>{title}</span>
            {icon !== undefined && icon}
          </div>
        ),
        ...rest,
      }
    }
  )

  return (
    <Dropdown
      overlay={
        <Menu onChange={(e) => console.log(e)} className='' items={menuItems} />
      }
      placement='bottomRight'
    >
      <button
        className={`absolute top-0 right-0  items-center justify-center flex w-5 h-5  mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700   `}
      >
        <ThreeDotIcon />
      </button>
    </Dropdown>
  )
}

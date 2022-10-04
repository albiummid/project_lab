import { useState } from 'react'
import { DebounceHandler } from '../../utils/utils'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FaFingerprint } from 'react-icons/fa'

export default function InputField({
  label,
  onChange = () => {},
  name = 'field name',
  placeholder,
  type = 'text',
  defaultValue,
  required,
  isError,
  error,
  icon,
  className,
}) {
  const [showPassword, setShowPassword] = useState(false)

  let ringColors = {
    red: 'border-1 border-red-500 ',
  }

  const handleChange = DebounceHandler((e) => {
    onChange({
      name: name,
      value: e.target.value,
    })
  }, 500)

  return (
    <div className='flex flex-col my-1'>
      {label?.length > 0 && (
        <label className='my-1 font-semibold' htmlFor=''>
          {label}
        </label>
      )}
      <div className={` ${className} `}>
        <div className='relative'>
          {type === 'textarea' ? (
            <textarea
              name={name}
              type={type}
              required={required}
              className={`appearance-none  block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500   focus:z-10 sm:text-sm rounded-md resize-none h-28 ${
                isError ? ringColors['red'] : 'border-gray-300'
              }`}
              placeholder={placeholder}
              defaultValue={defaultValue}
              onChange={handleChange}
            />
          ) : (
            <input
              name={name}
              type={
                type === 'password' && showPassword
                  ? 'text'
                  : type === 'password' && !showPassword
                  ? 'password'
                  : type
              }
              required={required}
              className={`appearance-none  block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500   focus:z-10 sm:text-sm rounded-md  ${
                isError ? ringColors['red'] : 'border-gray-300'
              }`}
              placeholder={placeholder}
              defaultValue={defaultValue}
              onChange={handleChange}
            />
          )}
          <div className=' absolute right-2 top-3 cursor-pointer'>
            {type === 'password' ? (
              <div onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <FaFingerprint className=' opacity-70' />
                ) : (
                  <FaFingerprint />
                )}
              </div>
            ) : (
              <div>{icon}</div>
            )}
          </div>
        </div>
      </div>
      <>
        {isError && (
          <div className='text-red-400 text-xs text-center bg-red-100 my-1 py-1 rounded-md'>
            {error?.length > 0
              ? error
              : name.substr(0, 1).toUpperCase() +
                name.substr(1) +
                ` is required !`}
          </div>
        )}
      </>
    </div>
  )
}

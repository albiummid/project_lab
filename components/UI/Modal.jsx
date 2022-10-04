import React from 'react'
import ReactDOM from 'react-dom'
import { AiOutlineCloseCircle } from 'react-icons/ai'

function Modal({
  open,
  children,
  onClose = () => {},
  modalRef,
  isDefault = true,
  closeOnOutsideClick = false,
  heading,
}) {
  if (!open) return null

  const JSX_MODAL = (
    <>
      <div
        className='h-screen w-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-[999]   '
        ref={modalRef}
        onClick={() => {
          closeOnOutsideClick && onClose()
        }}
      >
        <div
          className=' modal_container rounded-md  max-w-lg'
          onClick={(e) => e.stopPropagation()}
        >
          <AiOutlineCloseCircle
            onClick={() => {
              onClose()
            }}
            className=' ml-auto m-2 absolute right-0 text-lg cursor-pointer hover:text-red-400 '
          />
          {isDefault ? (
            <div className='p-4 min-h-[150px] md:min-w-[400px] w-full flex flex-col item-center'>
              <h1 className=' font-semibold text-xl'>{heading}</h1>
              {children}
            </div>
          ) : (
            <div className='p-2'> {children}</div>
          )}
        </div>
      </div>
    </>
  )
  return ReactDOM.createPortal(JSX_MODAL, document.querySelector('#modal'))
}

export default Modal

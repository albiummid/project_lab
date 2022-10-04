import lws_logo from './images/logo.png'

export const PlusIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='2'
      d='M12 6v6m0 0v6m0-6h6m-6 0H6'
    ></path>
  </svg>
)

export const ThreeDotIcon = () => {
  return (
    <svg
      className='w-4 h-4 fill-current'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
    </svg>
  )
}
export const CalenderIcon = () => {
  return (
    <svg
      className='w-4 h-4 text-gray-300 fill-current'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path
        fill-rule='evenodd'
        d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
        clip-rule='evenodd'
      />
    </svg>
  )
}

const assets = {
  images: {
    lws_logo,
  },
  icons: { PlusIcon, ThreeDotIcon, CalenderIcon },
}

export default assets

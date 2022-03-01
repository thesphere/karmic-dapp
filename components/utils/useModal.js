import { useEffect, useState } from 'react'

const useModal = (defaultState) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(
    () =>
      typeof defaultState === 'boolean'
        ? setShow(defaultState)
        : console.error('Passed default state is not a boolean'),
    []
  )

  return { show, handleShow, handleClose }
}

export default useModal

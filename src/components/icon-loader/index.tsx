import React, { useEffect, useState } from 'react'

interface Props {
  IconClass: React.FC
}
const IconLoader: React.FC<Props> = ({ IconClass }) => {
  const [icon, setIcon] = useState<React.ReactNode | null>(null)

  useEffect(() => {
    if (icon === null) {
      setIcon(<IconClass />)
    }
  }, [])

  return icon
}

export default IconLoader

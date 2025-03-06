import React, { Children } from 'react'

function Title({children,classname}) {
  return (
    <>
    <div  className={` ${classname} font-passero text-customOrange`}>
            {children}
    </div>
    </>
  )
}

export default Title
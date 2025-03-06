
export const  Button =({children
    ,type ="button",
    bgColor = "bg-orange-950",
    textColor = "text-white",
    classname= '',
    ...props
})=>{


    return (
        <button
        type={type}
        className={`group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium border-2 border-orange-200 text-orange-200 rounded-lg hover:text-orange-950 transition duration-300 ease-out ${classname}`} {...props}
      >
        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-orange-950 duration-300 -translate-x-full bg-orange-200 group-hover:translate-x-0 ease">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
        <span className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform group-hover:translate-x-full ease">{children}</span>
        <span className="relative invisible">${children}</span>
      </button>
    )

}
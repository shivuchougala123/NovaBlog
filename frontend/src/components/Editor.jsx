import { useRef, useEffect, useState } from 'react'

export default function Editor({ value, onChange }){
  const ref = useRef()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(()=>{
    // Only set innerHTML on initial load, not on every value change
    if(ref.current && !isInitialized) {
      ref.current.innerHTML = value || ''
      setIsInitialized(true)
    }
  },[value, isInitialized])

  function exec(cmd){
    document.execCommand(cmd, false)
  }

  function handleInput(){
    onChange(ref.current.innerHTML)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl glass border border-accent-main/20">
        <button 
          type="button" 
          onClick={()=>exec('bold')} 
          className="px-4 py-2 rounded-lg bg-gradient-blue text-gray-800 font-bold hover:scale-105 transition-all duration-300 shadow-blue-soft"
        >
          <span className="font-bold">B</span>
        </button>
        <button 
          type="button" 
          onClick={()=>exec('italic')} 
          className="px-4 py-2 rounded-lg bg-gradient-accent text-gray-800 font-bold hover:scale-105 transition-all duration-300 shadow-blue-soft"
        >
          <span className="italic">I</span>
        </button>
        <button 
          type="button" 
          onClick={()=>exec('underline')} 
          className="px-4 py-2 rounded-lg bg-gradient-soft text-gray-800 font-bold hover:scale-105 transition-all duration-300"
        >
          <span className="underline">U</span>
        </button>
        <button 
          type="button" 
          onClick={()=>exec('insertUnorderedList')} 
          className="px-4 py-2 rounded-lg bg-gradient-blue text-gray-800 font-bold hover:scale-105 transition-all duration-300"
        >
          • List
        </button>
        <button 
          type="button" 
          onClick={()=>exec('insertOrderedList')} 
          className="px-4 py-2 rounded-lg bg-gradient-accent text-gray-800 font-bold hover:scale-105 transition-all duration-300"
        >
          1. List
        </button>
      </div>
      <div 
        ref={ref} 
        onInput={handleInput} 
        contentEditable 
        suppressContentEditableWarning
        className="min-h-[300px] p-6 rounded-xl glass text-gray-800 border border-accent-main/20 focus:border-accent-main focus:shadow-blue-soft transition-all duration-300 prose prose-gray max-w-none"
        data-placeholder="Start writing your amazing content..."
      />
    </div>
  )
}


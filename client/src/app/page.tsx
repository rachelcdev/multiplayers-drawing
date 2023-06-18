"use client"
import { useState } from "react";
import useDraw from "./hooks/useDraw";
import { drawLine } from "./utils";
import {ChromePicker} from 'react-color';

export default function Home() {
  const [lineColor, setLineColor] = useState('#000000')

  const { canvasRef, handleOnMouseDown, handleClearCanvas } = useDraw(drawLine, lineColor)
  
  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={lineColor} onChange={e=>setLineColor(e.hex)}/>
        <button onClick={handleClearCanvas} className='border border-black rounded-md p-2' >Clear</button>
      </div>
      <canvas onMouseDown={handleOnMouseDown} ref={canvasRef} width={480} height={480} className='border border-black'/>
    </main>
  )
}

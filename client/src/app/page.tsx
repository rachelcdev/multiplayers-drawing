"use client"
import { useEffect, useState } from "react";
import useDraw from "./hooks/useDraw";
import { drawLine } from "./utils";
import {ChromePicker} from 'react-color';
import {io} from 'socket.io-client';
const socket = io('http://localhost:8080');

export default function Home() {

  const createLine = ({prevPoint, currPoint, ctx}: Draw) => {
    drawLine({prevPoint, currPoint, ctx, lineColor})
    // send to server
    socket.emit('draw-line', {prevPoint, currPoint, lineColor})
  }

  const [lineColor, setLineColor] = useState('#000000')

  const { canvasRef, handleOnMouseDown, handleClearCanvas } = useDraw(createLine)
  
  useEffect(() => {
    // listen to server
    socket.on('draw-line', ({prevPoint, currPoint, lineColor}: DrawLineResponse) => {
      const canvas = canvasRef.current
      if(!canvas) return 
      const ctx = canvas.getContext('2d')
      if(!ctx) return 
      drawLine({prevPoint, currPoint, ctx, lineColor})
    })
    return () => {
      socket.off('draw-line')
    }
  }, [canvasRef])

  const clearCanvasRequest = () => {
    socket.emit('clear-canvas')
  }
  // listen to server
  useEffect(() => {
    socket.on('clear-canvas', handleClearCanvas)
    return () => {
      socket.off('clear-canvas')
    }
  }, [handleClearCanvas])

  useEffect(() => {
    socket.emit('initial-canvas')
  }, [])

  useEffect(() => {
    socket.on('get-canvas-status', ()=>{
      const canvas = canvasRef.current
      if(!canvas) return 
      const data = canvas.toDataURL()
      if(!data) return 
      socket.emit('canvas-status', data)
    })
    return () => {
      socket.off('get-canvas-status')
    }
  })

  useEffect(() => {
    socket.on('get-canvas-status-from-server', (data: string)=>{
      const canvas = canvasRef.current
      if(!canvas) return 
      const ctx = canvas.getContext('2d')
      if(!ctx) return 
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = data
    })
    return () => {
      socket.off('get-canvas-status-from-server')
    }
  })

  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={lineColor} onChange={e=>setLineColor(e.hex)}/>
        <button onClick={clearCanvasRequest} className='border border-black rounded-md p-2' >Clear</button>
      </div>
      <canvas onMouseDown={handleOnMouseDown} ref={canvasRef} width={480} height={480} className='border border-black'/>
    </main>
  )
}

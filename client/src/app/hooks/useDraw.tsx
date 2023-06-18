"use client"
import { useCallback, useEffect, useRef, useState } from "react"

const useDraw = (onDraw: ({ctx,currPoint, prevPoint}: Draw, _: string)=>void, lineColor: string) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prevPoint = useRef<Point | null>(null)
    const [onMouseDown, setOnMouseDown] = useState(false)
    const handleOnMouseDown = () => {
        setOnMouseDown(true)
    }
    const handleOnMouseUp = () => {
        setOnMouseDown(false)
        prevPoint.current = null 
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if(!onMouseDown) return 
        const currPoint = getPointInCanvas(e);
        if (!currPoint) return
        const canvas = canvasRef.current
        if(!canvas) return 
        const ctx = canvas.getContext('2d')
        if (!ctx) return 
        onDraw({ctx, currPoint, prevPoint: prevPoint.current}, lineColor)
        prevPoint.current = currPoint
    }, [onMouseDown, onDraw, lineColor])

    const getPointInCanvas = (e: MouseEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        return {x, y}
    }

    const handleClearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if(canvas){
            canvas.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleOnMouseUp)
            console.log('add event listener') 
            return () => {
                canvas.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleOnMouseUp)
            }
        }
    }, [handleMouseMove])

    return {canvasRef, handleOnMouseDown, handleClearCanvas}
}
export default useDraw;

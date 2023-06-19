type Draw = {
    ctx: CanvasRenderingContext2D
    currPoint: Point
    prevPoint: Point | null
  }
  
type Point = { x: number; y: number }

type DrawWithColor = Draw & {
  lineColor: string
}

type DrawLineResponse = {
  currPoint: Point
  prevPoint: Point | null
  lineColor: string
}
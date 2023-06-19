export const drawLine = ({ctx, currPoint, prevPoint, lineColor}: DrawWithColor) => {
  const startPoint = prevPoint || currPoint;
  const lineWidth = 5
  
  ctx.strokeStyle = lineColor
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(currPoint.x, currPoint.y)
  ctx.stroke()

  ctx.fillStyle = lineColor
  ctx.beginPath()
  ctx.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, Math.PI * 2)
  ctx.fill()

}
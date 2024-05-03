/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react"
import ForceGraph2D from "react-force-graph-2d"

import "../../global.css"
import { convertAssetToGraphFormat } from "../../lib/graph"
import { Asset } from "../../lib/types"
import { useIPAssetContext } from "../../providers"

export type IPAGraphProps = {
  width?: number
  height?: number
}

function IPAGraph({ width = 500, height = 500 }: IPAGraphProps) {
  const { assetData } = useIPAssetContext()
  const formattedGraphData = useMemo(() => assetData && convertAssetToGraphFormat(assetData as Asset), [assetData])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeCanvasObject = (node: any, ctx: any, globalScale: any) => {
    const isParent = node.level < 0
    const isSelf = node.level === 0
    const isChild = node.level > 0

    let label

    if (node.isRoot) {
      if (isParent) {
        label = `${node.name} (Root / Parent)`
      } else {
        label = `${node.name} (Root)`
      }
    } else if (isParent) {
      label = `${node.name} (Parent)`
    } else if (isChild) {
      label = `${node.name} (Child)`
    } else {
      label = `${node.name}`
    }

    const fontSize = 12 / globalScale
    const circleRadius = isSelf ? 6 : 3 // Radius of the circle

    // Set the font for the text
    ctx.font = `${fontSize}px Sans-Serif`

    // Draw the circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, circleRadius, 0, 2 * Math.PI, false)
    if (isSelf) {
      ctx.fillStyle = "black" // Color of the circle
    } else if (isParent) {
      ctx.fillStyle = "grey" // Color of the circle
    } else {
      ctx.fillStyle = "lightgrey" // Color of the circle
    }

    ctx.fill()
    if (isSelf) {
      ctx.strokeStyle = "lightblue" // Border color of the circle
      ctx.stroke()
    }

    // Draw the text next to the circle
    ctx.fillText(label, node.x, node.y + 10)
  }

  return (
    <div className="relative">
      <ForceGraph2D width={width} height={height} graphData={formattedGraphData} nodeCanvasObject={nodeCanvasObject} />
    </div>
  )
}

IPAGraph.displayName = "IPAGraph"

export default IPAGraph
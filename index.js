// https://fr.wikipedia.org/wiki/Algorithme_A*
// A* Search Algorithm

// node {
//   x,
//   y,
//   cost,
//   h,
//   parentNode,
// }

function sortNodes(node1, node2) {
  if (node1.h > node2.h) return 1
  if (node1.h < node2.h) return -1
  return 0
}

function getFinalPath(graph, end) {
  const node = graph.get(end.x).get(end.y)
  const mappedNode = {
    x: node.x,
    y: node.y,
    cost: node.cost,
  }

  if (!node.parentNode) return [mappedNode]

  return [...getFinalPath(graph, node.parentNode), mappedNode]
}

function defaultSameNode(node1, node2) {
  return node1.x === node2.x && node1.y === node2.y
}

function defaultGetNeighbours(graph, node) {
  const neighbours = []

  function getAndAdd(x, y) {
    if (!graph.has(x)) return

    const graphNode = graph.get(x).get(y)
    if (!graphNode) return

    neighbours.push(graphNode)
  }

  // left
  getAndAdd(node.x - 1, node.y)
  // right
  getAndAdd(node.x + 1, node.y)
  // top
  getAndAdd(node.x, node.y - 1)
  // bottom
  getAndAdd(node.x, node.y + 1)

  return neighbours
}

function defaultDistance(node, end) {
  const x = end.x - node.x
  const y = end.y - node.y

  return x * x + y * y
}

function defaultMapGraph(graph) {
  const rows = new Map()

  graph.forEach((cell) => {
    const row = rows.get(cell.x) || new Map()
    if (!rows.has(cell.x)) rows.set(cell.x, row)

    row.set(cell.y, { ...cell })
  })

  return rows
}

module.exports = function getClosestPath(
  graph,
  start,
  end,
  {
    sameNode = defaultSameNode,
    mapGraph = defaultMapGraph,
    getNeighbours = defaultGetNeighbours,
    distance = defaultDistance,
    heuristic = () => 1,
    maxLoops = Infinity,
  } = {},
) {
  const mappedGraph = mapGraph(graph)

  const closedList = []
  const openList = []

  function getNode({ x, y }) {
    return mappedGraph.get(x).get(y)
  }

  function updateNode(node) {
    mappedGraph.get(node.x).set(node.y, node)
    return node
  }
  openList.push(updateNode({ ...start, cost: 0 }))

  let loop = -1
  while (openList.length > 0 && loop++ < maxLoops) {
    const current = getNode(openList.shift())

    if (current.cost === Infinity) {
      return {
        status: 'not_found',
        path: [],
        loops: loop,
      }
    }

    if (sameNode(current, end)) {
      return {
        status: 'success',
        path: getFinalPath(mappedGraph, current),
        loops: loop,
      }
    }

    const neighbours = getNeighbours(mappedGraph, current)
    for (let i = 0; i < neighbours.length; i += 1) {
      const neighbour = getNode(neighbours[i])
      const known = neighbour.cost !== undefined

      if (closedList.find((n) => sameNode(n, neighbour))) continue

      const newCost =
        (current.cost || 0) + heuristic({ ...current }, { ...neighbour })

      if (known && neighbour.cost < newCost) continue

      const newNeighbour = updateNode({
        ...neighbour,
        cost: newCost,
        h: newCost + distance(neighbour, end),
        parentNode: {
          x: current.x,
          y: current.y,
        },
      })

      if (!known) openList.push(newNeighbour)
      openList.sort(sortNodes)
    }

    closedList.push(current)
  }

  if (loop >= maxLoops) {
    return {
      status: 'not_optimized',
      path: getFinalPath(mappedGraph, openList[0]),
      loops: loop,
    }
  }

  return { status: 'not_found', path: [], loops: loop }
}

// https://fr.wikipedia.org/wiki/Algorithme_A*
// A* Search Algorithm

// node: [x, y, cost, h, parentNode]

function identity(o) {
  return o
}
function sortNodes(node1, node2) {
  if (node1[3] > node2[3]) return 1
  if (node1[3] < node2[3]) return -1
  return 0
}
function getFinalPath(end) {
  if (!end[4]) return [end.slice(0, 3)]
  return [...getFinalPath(end[4]), end.slice(0, 3)]
}
function defaultSameNode(node1, node2) {
  return node1[0] === node2[0] && node1[1] === node2[1]
}

function defaultGetNeighbours(graph, node, { mapNode = identity } = {}) {
  const neighbours = []

  // left
  let next = graph[node[0] - 1] && graph[node[0] - 1][node[1]]
  if (next) neighbours.push(mapNode(next))

  // right
  next = graph[node[0] + 1] && graph[node[0] + 1][node[1]]
  if (next) neighbours.push(mapNode(next))

  // top
  next = graph[node[0]][node[1] - 1]
  if (next) neighbours.push(mapNode(next))

  // bottom
  next = graph[node[0]][node[1] + 1]
  if (next) neighbours.push(mapNode(next))

  return neighbours
}

function defaultDistance(node, end) {
  const x = end[0] - node[0]
  const y = end[1] - node[1]

  return x * x + y * y
}

module.exports = function getClosestPath(
  graph,
  start,
  end,
  {
    sameNode = defaultSameNode,
    mapGraph = identity,
    mapNode = identity,
    getNeighbours = defaultGetNeighbours,
    distance = defaultDistance,
    heuristic = () => 1,
    maxLoops = Infinity,
  } = {},
) {
  const mappedGraph = mapGraph(
    [...graph].map((row) => [...row].map((cell) => [...cell])),
  )
  const closedList = []
  const openList = []

  openList.push(mapNode(start).concat(0))

  let loop = -1
  while (openList.length > 0 && loop++ < maxLoops) {
    const current = openList.shift()

    if (current[2] === Infinity) {
      return [-2, [], loop]
    }

    if (sameNode(current, end)) {
      return [0, getFinalPath(current), loop]
    }

    const neighbours = getNeighbours(mappedGraph, current, { mapNode })
    for (let i = 0; i < neighbours.length; i += 1) {
      const neighbour = neighbours[i]
      const known = neighbour[2] !== undefined

      if (closedList.find((n) => sameNode(n, neighbour))) continue

      const newCost =
        (current[2] || 0) +
        heuristic(current.slice(0, 2), neighbour.slice(0, 2))

      if (known && neighbour[2] < newCost) continue

      neighbour[2] = newCost
      neighbour[3] = neighbour[2] + distance(neighbour, end)
      neighbour[4] = current
      if (!known) openList.push(neighbour)
      openList.sort(sortNodes)
    }

    closedList.push(current)
  }

  if (loop >= maxLoops) {
    return [1, getFinalPath(openList[0]), loop]
  }

  return [-1, [], loop]
}

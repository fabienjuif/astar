/* eslint-env jest */
const getClosestPath = require('./index')

const graph = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 0, y: 3 },
  { x: 0, y: 4 },
  { x: 0, y: 5 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 2, y: 5 },
]

it('should find the closest path with all default', () => {
  expect(getClosestPath(graph, { x: 0, y: 0 }, { x: 2, y: 3 })).toEqual({
    status: 'success',
    path: [
      { x: 0, y: 0, cost: 0 },
      { x: 0, y: 1, cost: 1 },
      { x: 1, y: 1, cost: 2 },
      { x: 1, y: 2, cost: 3 },
      { x: 2, y: 2, cost: 4 },
      { x: 2, y: 3, cost: 5 },
    ],
    loops: 5,
  })
})

it('should get the best path with the max loops exceed', () => {
  expect(
    getClosestPath(graph, { x: 0, y: 0 }, { x: 2, y: 3 }, { maxLoops: 2 }),
  ).toEqual({
    status: 'not_optimized',
    path: [
      { x: 0, y: 0, cost: 0 },
      { x: 0, y: 1, cost: 1 },
      { x: 1, y: 1, cost: 2 },
      { x: 1, y: 2, cost: 3 },
    ],
    loops: 3,
  })
})

it('should not find a path', () => {
  expect(getClosestPath(graph, { x: 0, y: 0 }, { x: 3, y: 3 })).toEqual({
    status: 'not_found',
    path: [],
    loops: 14,
  })
})

it('should not find a path because all nodes are walls', () => {
  expect(
    getClosestPath(
      graph,
      { x: 0, y: 0 },
      { x: 2, y: 3 },
      { heuristic: () => Infinity },
    ),
  ).toEqual({
    status: 'not_found',
    path: [],
    loops: 1,
  })
})

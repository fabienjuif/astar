/* eslint-env jest */
const getClosestPath = require('./index')

const graph = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
  ],
]

it('should find the closest path with all default', () => {
  expect(getClosestPath(graph, [0, 0], [2, 3])).toEqual([
    // route found
    0,
    // path
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 2],
      [1, 2, 3],
      [2, 2, 4],
      [2, 3, 5],
    ],
    // loops
    5,
  ])
})

it('should get the best path with the max loops exceed', () => {
  expect(getClosestPath(graph, [0, 0], [2, 3], { maxLoops: 2 })).toEqual([
    // hit max loops
    1,
    // path
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 2],
      [1, 2, 3],
    ],
    // loops
    3,
  ])
})

it('should not find a path', () => {
  expect(getClosestPath(graph, [0, 0], [3, 3])).toEqual([
    // path not found
    -1,
    // path
    [],
    // loops
    14,
  ])
})

it('should not find a path because all nodes are walls', () => {
  expect(
    getClosestPath(graph, [0, 0], [2, 3], { heuristic: () => Infinity }),
  ).toEqual([
    // path not found (blocked)
    -2,
    // path
    [],
    // loops
    1,
  ])
})

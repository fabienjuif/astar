# @fabienjuif/astar

> an A\* algorithm in javascript

## Installation

`npm install --save @fabienjuif/astar`

## Usage

```js
const getClosestPath = require('@fabienjuif/astar')

getClosestPath(
  // array of rows that contains cells
  graph,
  // starting cell [x, y]
  start,
  // ending cell [x, y]
  end,
  // all the rest of parameters are **not required**
  // but you can use them to tweak the engine
  ({
    // function to test two node are the same
    sameNode = defaultSameNode,
    // function that map the given graph to the one that the engine needs
    mapGraph = identity,
    // function that map given cells to the ones that the engine needs
    mapNode = identity,
    // function to get neighbours of a cell (default works with squared cells)
    getNeighbours = defaultGetNeighbours,
    // function to get distance between 2 cells, default use pythagore (without the square root)
    distance = defaultDistance,
    // your heuristic
    heuristic = () => 1,
    // max loops before stoping the engine
    maxLoops = Infinity,
  } = {}),
)
```

- Node are representated in array `[x, y]`
- Graph is an array of cells

<!-- prettier-ignore -->
```js
const graph = [
  // first line (x === 0)
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  // second line (x === 1)
  [[1, 0], [1, 1], [1, 2]],
  // third line (x === 2)
  [[2, 0], [2, 1], [2, 2], [2, 3],[2, 4],[2, 5]],
]

// get cells at x = 2, y = 3
console.log(graph[2][3])
// > [2, 3]
```

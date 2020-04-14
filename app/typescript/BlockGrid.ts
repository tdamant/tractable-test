import {Block} from "./Block";

type Column = Block[];
type Grid = Column[]
const MAX_X = 10;
const MAX_Y = 10;

export class BlockGrid {
  public grid: Grid;

  constructor(givenGrid? : Grid) {
    this.grid = givenGrid || [];

    if (!givenGrid) {
      for (let x = 0; x < MAX_X; x++) {
        const col: Block[] = [];
        for (let y = 0; y < MAX_Y; y++) {
          col.push(new Block(x, y));
        }

        this.grid.push(col);
      }
    }

    return this;
  }

  redrawBlock(blockEl: HTMLDivElement, block: Block) {
    const {x, y, colour} = block;
    blockEl.id = `block_${x}x${y}`;
    blockEl.className = 'block';
    blockEl.style.background = colour;
  }

  getNeighbours(block: Block): Block[] {
    const {x, y} = block;
    const neighbouringCoords = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
    return neighbouringCoords.map(([x,y]) => {
      const col = this.grid[x];
      return col ? col[y] || null : null
    }).filter(block => !!block)
  }

  getSameColourNeighbours(block: Block): Block[] {
    return this.getNeighbours(block).filter(neighbour => block.colour === neighbour.colour);
  }

  render(grid = document.querySelector('#gridEl') as Element) {
    let el = grid.cloneNode(false);
    grid.parentNode.replaceChild(el, grid);
    for (let x = 0; x < MAX_X; x++) {
      const id = 'col_' + x;
      const colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        const block = this.grid[x][y];
        const blockEl = document.createElement('div');

        if (block.clickable) {
          blockEl.addEventListener('click', (evt) => this.blockClicked(evt, block));
        }

        colEl.appendChild(blockEl);
        this.redrawBlock(blockEl, block);
      }
    }

    return this;
  }

  blockClicked(e: Event, block: Block) {
    const neighbours = this.getConnectingSameColour([block]);
    if(neighbours.length === 1) {
      return
    }
    const columns = neighbours.map(block => block.x);
    [...neighbours, block].forEach(block => block.clear());
    [...columns].forEach(column => this.reorderColumn(this.grid[column]));
    this.render();
  }

  getConnectingSameColour(blocks: Block[], allBlocks: Block[] = []): Block[] {
    if(!blocks.length) {
      return allBlocks
    }
    allBlocks.push(...blocks);
    const neighbours = [].concat(...blocks.map(block => this.getSameColourNeighbours(block).filter((neigh) => allBlocks.indexOf(neigh) === -1)));
    return this.getConnectingSameColour(neighbours, allBlocks);
  }

  reorderColumn(column: Column) {
    const reordered = column.sort((a, b) => Number(b.clickable) - Number(a.clickable));
    reordered.forEach((block, index) => block.y = index);
    this.grid[column[0].x] = reordered;
  }
}

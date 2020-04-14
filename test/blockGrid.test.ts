import {expect} from "chai";
import {BlockGrid} from "../app/typescript/BlockGrid";
import {Block} from "../app/typescript/Block";

describe("BlockGrid", function () {
  const blockGrid = new BlockGrid();

  describe('getNeighbours', () => {
    it('returns the neighbours to either side and above', () => {
      const block = new Block(2, 2);
      const neighbours = blockGrid.getNeighbours(block);
      const neighboursCoords = neighbours.map(block => ({x: block.x, y: block.y}));
      expect(neighboursCoords).to.eql([
        {x: 1, y: 2},
        {x: 3, y: 2},
        {x: 2, y: 1},
        {x: 2, y: 3},
      ])
    });
    it('returns correct results for corner blocks', () => {
      const block = new Block(0, 0);
      const neighbours = blockGrid.getNeighbours(block);
      const neighboursCoords = neighbours.map(block => ({x: block.x, y: block.y}));
      expect(neighboursCoords).to.eql([
        {x: 1, y: 0},
        {x: 0, y: 1},
      ])
    });
    it('returns correct results for blocks on the edges', () => {
      const block = new Block(0, 5);
      const neighbours = blockGrid.getNeighbours(block);
      const neighboursCoords = neighbours.map(block => ({x: block.x, y: block.y}));
      expect(neighboursCoords).to.eql([
        {x: 1, y: 5},
        {x: 0, y: 4},
        {x: 0, y: 6},
      ])
    });
  });

  describe('getSameColourNeighbours', () => {
    it('only returns neighbours of same colour', () => {
      const middleBlock = new Block(1, 1, "red");
      const sameColourLeft = new Block(0, 1, "red");
      const sameColourAbove = new Block(1, 2, "red");
      const grid: Block[][] = [
        [new Block(0, 0, 'red'), sameColourLeft, new Block(0, 2, "red")],
        [new Block(1, 0, "yellow"), middleBlock, sameColourAbove],
        [new Block(2, 0, "red"), new Block(2, 1, "blue"), new Block(2, 2, "red")],
      ];
      const blockGrid = new BlockGrid(grid);
      const sameColours = blockGrid.getSameColourNeighbours(middleBlock);
      expect(sameColours).to.eql([
        sameColourLeft, sameColourAbove
      ])
    });
  });

  describe('getConnectingSameColour', () => {
    it('returns given block if no connections', () => {
      const middleBlock = new Block(1, 1, "red");
      const grid: Block[][] = [
        [new Block(0, 0, "yellow"), new Block(0, 1, 'yellow'), new Block(0, 2, "yellow")],
        [new Block(1, 0, "yellow"), middleBlock, new Block(1, 2, "yellow")],
        [new Block(2, 0, "yellow"), new Block(2, 1, "yellow"), new Block(2, 2, "yellow")],
      ];
      const blockGrid = new BlockGrid(grid);
      const sameColours = blockGrid.getConnectingSameColour([middleBlock]);
      expect(sameColours).to.eql([
        middleBlock
      ])
    });
    it('return all same colour neighbours and their same colour neighbours ', () => {
      const middleBlock = new Block(1, 1, "red");
      const DiagonalLeftDown = new Block(0, 0, "red");
      const Left = new Block(0, 1, "red");
      const DiagonalLeftUp = new Block(0, 2, "red");
      const grid: Block[][] = [
        [DiagonalLeftDown, Left,  DiagonalLeftUp],
        [new Block(1, 0, "yellow"), middleBlock, new Block(1, 2, "blue")],
        [new Block(2, 0, "red"), new Block(2, 1, "blue"), new Block(2, 2, "red")],
      ];
      const blockGrid = new BlockGrid(grid);
      const sameColours = blockGrid.getConnectingSameColour([middleBlock]);
      expect(sameColours).to.eql([
        middleBlock, Left, DiagonalLeftDown, DiagonalLeftUp
      ])
    });
    it('returns whole column if all same colour ', () => {
      const column = [];
      for(let i = 0; i < 10; i++) {
        column.push(new Block(0, i, 'red'))
      }
      const blockGrid = new BlockGrid([column]);
      const sameColours = blockGrid.getConnectingSameColour([column[0]]);
      expect(sameColours).to.eql(column)
    });
  });

  describe('reorderColumn', () => {
    it('leaves column unchanged if no blocks are unclickable', () => {
      const bottomBlock = new Block(0, 0);
      const middleBlock = new Block(0, 1);
      const topBlock = new Block(0, 2);
      const column: Block[] = [
        bottomBlock,
        middleBlock,
        topBlock,
      ];
      const blockGrid = new BlockGrid([column]);
      blockGrid.reorderColumn(column);
      expect(blockGrid.grid[0]).to.eql(column)
    });
    it('moves unclickable blocks to the top', () => {
      const bottomBlock = new Block(0, 0);
      const middleBlock = new Block(0, 1);
      const topBlock = new Block(0, 2);
      const column: Block[] = [
        bottomBlock,
        middleBlock,
        topBlock,
      ];
      const blockGrid = new BlockGrid([column]);
      bottomBlock.clear();
      blockGrid.reorderColumn(column);
      expect(blockGrid.grid[0]).to.eql([middleBlock, topBlock, bottomBlock])
    });
  });
});

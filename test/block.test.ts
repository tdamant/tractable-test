import {expect} from "chai";
import {Block} from "../app/typescript/Block";

describe("Block", () => {
  describe('clear', () => {
    it('should turn the block white and make it not clickable', () => {
      const block = new Block(2, 4);
      block.clear();
      expect(block.colour).to.eql('white');
      expect(block.clickable).to.eql(false)
    });
    it('should be idempotent', () => {
      const block = new Block(2, 4);
      block.clear();
      block.clear();
      expect(block.colour).to.eql('white');
      expect(block.clickable).to.eql(false)
    });
  })
});

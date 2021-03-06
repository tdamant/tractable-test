type Colour = 'red' | 'green' | 'blue' | 'yellow' | 'white'
const COLOURS: Colour[] = ['red', 'green', 'blue', 'yellow'];

export class Block {
  colour: Colour;
  clickable: boolean;

  constructor(public x: number, public y: number, givenColour?: Colour) {
    this.colour = givenColour || COLOURS[Math.floor(Math.random() * COLOURS.length)];
    this.clickable = true;
  }

  clear() {
    this.colour = 'white';
    this.clickable = false
  }
}


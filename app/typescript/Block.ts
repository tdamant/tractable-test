type Colour = 'red' | 'green' | 'blue' | 'yellow' | 'white'
const COLOURS: Colour[] = ['red', 'green', 'blue', 'yellow'];

export class Block {
  public colour: Colour;
  public clickable: boolean;

  constructor(public x: number, public y: number, givenColour?: Colour) {
    this.colour = givenColour || COLOURS[Math.floor(Math.random() * COLOURS.length)];
    this.clickable = true;
  }
}


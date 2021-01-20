export class MyLibrary {
  private static COUNTER: number = 0;
  private readonly id: number;
  constructor() {
    this.id = MyLibrary.COUNTER++;
  }

  public getId(): number {
    return this.id;
  }
}

export class GradientGenerator {
  constructor(public node: HTMLElement) {
    if (!node) {
      throw new Error('Root element must be provided');
    }
  }

  getElement(): HTMLElement {
    return this.node;
  }

  generate(size: number) {
    this.node.innerHTML = 'hola ' + size;
  }
}

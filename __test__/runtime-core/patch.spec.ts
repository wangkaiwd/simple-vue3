import { h, render } from '../../lib';
// import { h, render } from 'vue';

// diff algorithm logic
// 1. sync from start
// 2. sync from end
// 3. common sequence + mount
// 4. common sequence + unmount
// 5. unknown sequence
//    5.1. build key:index map for newChildren
//    5.2. loop through old children
//    5.3. move and mount

describe('runtime-core:patch', () => {
  let app;
  beforeEach(() => {
    app = document.createElement('div');
  });
  it('should render different element', () => {
    render(h('h2', { id: 'test', style: { color: 'red' } }, 1), app);
    render(h('h3', { id: 'test1', style: { color: 'green' } }, 2), app);

    expect(app.children[0].outerHTML).toBe(`<h3 id="test1" style="color: green;">2</h3>`);
  });
  it('should patch text node', () => {
    render(h('h2', {}, 1), app);
    render(h('h2', {}, 2), app);
    expect(app.children[0].outerHTML).toBe(`<h2>2</h2>`);
  });
  it('should patch different children', () => {
    render(h('h2', {}, ''), app);
    render(h('h2', {}, 2), app);
    expect(app.children[0].outerHTML).toBe(`<h2>2</h2>`);
  });
  it('should patch list: common sequence + after mount', () => {
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
    ]), app);
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
    ]), app);
    expect(app.children[0].outerHTML).toBe(`<ul id="ul"><li>A</li><li>B</li><li>C</li></ul>`);
  });
  it('should patch list: common sequence + before mount', () => {
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
    ]), app);
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
    ]), app);
    expect(app.children[0].outerHTML).toBe(`<ul id="ul"><li>C</li><li>A</li><li>B</li></ul>`);
  });
  it('should patch list: common sequence + before unmount', () => {
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
    ]), app);
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
    ]), app);
    expect(app.children[0].outerHTML).toBe(`<ul id="ul"><li>A</li><li>B</li></ul>`);
  });
  it('should patch list: common sequence + after unmount', () => {
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
    ]), app);
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
    ]), app);
    expect(app.children[0].outerHTML).toBe(`<ul id="ul"><li>A</li><li>B</li></ul>`);
  });
  it('should patch list: unknown sequence', () => {
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'D' }, 'D'),
      h('li', { key: 'E' }, 'E'),
      h('li', { key: 'F' }, 'F'),
      h('li', { key: 'G' }, 'G'),
    ]), app);
    render(h('ul', { id: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'E' }, 'E'),
      h('li', { key: 'D' }, 'D'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'H' }, 'H'),
      h('li', { key: 'F' }, 'F'),
      h('li', { key: 'G' }, 'G'),
    ]), app);
    expect(app.children[0].outerHTML).toBe(`<ul id="ul"><li>A</li><li>B</li><li>E</li><li>D</li><li>C</li><li>H</li><li>F</li><li>G</li></ul>`);
  });
});

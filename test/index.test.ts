import { Ereignis } from '../src';

type EventMap = {
  hello: (arg: string) => void;
  done: () => void;
};
const double = (n: number) => n * 2;

describe('blah', () => {
  const testEreignis = new Ereignis<EventMap>();
  it('works', () => {
    testEreignis.on('hello', (stuff: string) => console.log(stuff));
    testEreignis.on('done', (test: string) => console.log('hello'));
    // testEreignis.on('done', () => console.log('stuff'));
    // testEreignis.emit('done');
    testEreignis.emit('done');
    expect(true).toEqual('off');
  });
});

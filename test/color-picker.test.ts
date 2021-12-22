import {hexToRGBA} from '../library';

describe('library', () => {
  test('hexToRGBA 3 digits', async () => {
    expect(hexToRGBA('#121')).toMatchObject({
      r: 17, g: 34, b: 17, a: 1
    });
    expect(hexToRGBA('#abc')).toMatchObject({
      r: 170, g: 187, b: 204, a: 1
    });
  });
  test('hexToRGBA 6 digits', async () => {
    expect(hexToRGBA('#abcdef')).toMatchObject({
      r: 171, g: 205, b: 239, a: 1
    });
  });
  test('hexToRGBA 8 digits', async () => {
    expect(hexToRGBA('#abcdef80')).toMatchObject({
      r: 171, g: 205, b: 239, a: 0.5019607843137255
    });
    expect(hexToRGBA('#abcdefff')).toMatchObject({
      r: 171, g: 205, b: 239, a: 1
    });
    expect(hexToRGBA('#abcdef00')).toMatchObject({
      r: 171, g: 205, b: 239, a: 0
    });
  });
});

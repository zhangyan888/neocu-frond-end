/**
 * Created by ssehacker on 2016/10/13.
 */

// 支持ES6 语法
import assert from 'assert';

describe('Demo test', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

describe('async test', () => {
  let shouldStart = false;

  beforeEach((done) => {
    setTimeout(() => {
      shouldStart = true;
      done();
    });
  }, 50);

  it('should print something in 2000 ms', (done) => {
    setTimeout(() => {
      done();
    }, 1900);
  });

  it('promise support', () => (
    Promise.resolve('hello world')
      .then((str) => {
        assert.equal(str, 'hello world');
      })
  ));

  it('shouldStart parameter should be modified success', () => {
    assert.equal(true, shouldStart);
  });
});

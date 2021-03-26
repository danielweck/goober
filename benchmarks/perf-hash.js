const Benchmark = require('benchmark');

const str = `abcdefghijklmnopqrstuvwyxz ABCDEFGHIJKLMNOPQRSTUVWYXZ 0123456789`

// Note: performance comparisons between hash implementations
// produce susprinsingly different results depending on web browsers.
// (see https://github.com/cristianbote/goober/pull/271 where tests are made
// with https://perf.link and https://esbench.com )
// For example, it turns out that Math.imul() -based hashing is
// more performant in Firefox and Safari, than in Chrome.
// That being said, Goober's "improved" hash implementation (see below)
// is consistently faster in all JS runtimes (including Node).

const suite = new Benchmark.Suite("HASH!");
suite
.add('Goober original HASH', () => {
    const c = 'go' + str.split('').reduce((out, s) => (101 * out + s.charCodeAt(0)) >>> 0, 11);
})
.add('Goober improved HASH', () => {
    let i = 0, l = str.length, out = 11;
    while (i < l) out = (101 * out + str.charCodeAt(i++)) >>> 0
    const c = 'go' + out;
})
.on('start', function (e) {
    console.log('\nStarting', e.currentTarget.name);
})
.on('error', (e) => console.log(e))
.on('cycle', function (event) {
    console.log('▸', String(event.target));
})
.on('complete', function () {
    const fastest = this.filter('fastest').map('name')[0];
    console.log('\nFastest is: ' + fastest);
})
.run();
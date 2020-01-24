import Tester from './utils/Tester.js';
const test = new Tester('test', 'users');

describe('Exclude subkeys', () => {
  const sampleData = [
    {name:'Walter', someNestedObject:{a:{b:{c:{d:{e:1}}}}}, otherNestedObject:{a:{b:{c:{d:{e:1}}}}}}
  ];

  beforeEach(() => test.init(sampleData));
  afterEach(() => test.cleanUp());

  it('should exclude some subkeys', async () => {
    const results = await test.runJsonAnalysis({collection:'users',excludeSubkeys:['someNestedObject.a.b']}, true);

    results.validateResultsCount(11);
    results.validate('_id', 1, 100.0, {ObjectId: 1});
    results.validate('name', 1, 100.0, {String: 1});
    results.validate('someNestedObject', 1, 100.0, {Object: 1});
    results.validate('someNestedObject.a', 1, 100.0, {Object: 1});
    results.validate('someNestedObject.a.b', 1, 100.0, {Object: 1});
    // no more descendants of someNestedObject.a.b, they are excluded

    results.validate('otherNestedObject', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d.e', 1, 100.0, {Number: 1});
  });

  it('should exclude some subkeys excluding root', async () => {
    const results = await test.runJsonAnalysis({collection:'users',excludeSubkeys:['someNestedObject']}, true);

    results.validateResultsCount(9);
    results.validate('_id', 1, 100.0, {ObjectId: 1});
    results.validate('name', 1, 100.0, {String: 1});
    results.validate('someNestedObject', 1, 100.0, {Object: 1});
    // no more descendants of someNestedObject, they are excluded

    results.validate('otherNestedObject', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d.e', 1, 100.0, {Number: 1});
  });  
});

describe('Exclude subkeys with pattern matching (*)', () => {
  const sampleData = [
    {name:'Walter', someNestedObject:{a:{b:{c1:{d:{e:1}},c2:{f:2}}}}, otherNestedObject:{a:{b:{c:{d:{e:1}}}}}}
  ];

  beforeEach(() => test.init(sampleData));
  afterEach(() => test.cleanUp());

  it('should ignore subkeys matching a pattern)', async () => {
    const results = await test.runJsonAnalysis({collection:'users',excludeSubkeys:['someNestedObject.a.b.c*']}, true);

    results.validateResultsCount(13);
    results.validate('_id', 1, 100.0, {ObjectId: 1});
    results.validate('name', 1, 100.0, {String: 1});
    results.validate('someNestedObject', 1, 100.0, {Object: 1});
    results.validate('someNestedObject.a', 1, 100.0, {Object: 1});
    results.validate('someNestedObject.a.b', 1, 100.0, {Object: 1});
    results.validate('someNestedObject.a.b.c1', 1, 100.0, {Object: 1});
    results.validate('someNestedObject.a.b.c2', 1, 100.0, {Object: 1});
    // no more descendants of someNestedObject, they are excluded

    results.validate('otherNestedObject', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d.e', 1, 100.0, {Number: 1});
  });

  it('should ignore subkeys matching a pattern, excluding root)', async () => {
    const results = await test.runJsonAnalysis({collection:'users',excludeSubkeys:['someNestedObject*']}, true);

    results.validateResultsCount(9);
    results.validate('_id', 1, 100.0, {ObjectId: 1});
    results.validate('name', 1, 100.0, {String: 1});
    results.validate('someNestedObject', 1, 100.0, {Object: 1});
    // no more descendants of someNestedObject, they are excluded

    results.validate('otherNestedObject', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d', 1, 100.0, {Object: 1});
    results.validate('otherNestedObject.a.b.c.d.e', 1, 100.0, {Number: 1});
  });
});
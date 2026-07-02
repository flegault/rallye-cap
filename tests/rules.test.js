const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load-browser-module');
const rules = load('rules.js', 'RallyeCapRules');

const players = ['p1','p2','p3','p4','p5','p6','p7','p8'];
const valid = [
  {pos:{p1:'1B',p2:'2B',p3:'3B',p4:'AC',p5:'L1',p6:'L2'}},
  {pos:{p2:'1B',p3:'2B',p4:'3B',p7:'AC',p8:'L1',p1:'L2'}},
  {pos:{p3:'1B',p4:'2B',p7:'3B',p8:'AC',p5:'L1',p6:'L2'}},
  {pos:{p5:'1B',p6:'2B',p7:'AC',p8:'3B',p1:'L1',p2:'L2'}}
];

test('un horaire valide respecte les règles obligatoires', () => assert.equal(rules.validateSchedule(valid, players).ok, true));
test('détecte les violations défensives obligatoires', () => {
  const duplicate = rules.validateSchedule([{pos:{p1:'1B',p2:'1B',p3:'3B',p4:'AC',p5:'L1',p6:'L2'}}], players);
  const unknown = rules.validateSchedule([{pos:{p1:'1B',p2:'2B',p3:'3B',p4:'AC',p5:'L1',p6:'XX'}}], players);
  assert.ok(duplicate.violations.some(v => v.rule === 'position-unique'));
  assert.ok(unknown.violations.some(v => v.rule === 'known-position'));
});
test('détecte les répétitions interdites', () => {
  const schedule = [
    {pos:{p1:'1B',p2:'2B',p3:'3B',p4:'AC',p5:'L1',p6:'L2'}},
    {pos:{p1:'1B',p2:'2B',p3:'3B',p4:'AC',p5:'L1',p6:'L2'}}
  ];
  const violations = rules.validateSchedule(schedule, players).violations;
  assert.ok(violations.some(v => v.rule === 'first-base-once'));
  assert.ok(violations.some(v => v.rule === 'pitch-consecutive'));
  assert.ok(violations.some(v => v.rule === 'bench-consecutive'));
});
test('nettoie les joueurs et positions inconnus', () => {
  assert.deepEqual({...rules.cleanPositions({p1:'1B',p2:'XX',ghost:'2B'}, players)}, {p1:'1B'});
});
test('calcule les statistiques et l’équité', () => {
  const stats = rules.collectStats(valid, players, {p1:2,p2:2,p3:2,p4:1,p5:1,p6:1,p7:1,p8:1}, true);
  assert.equal(stats.p1.total, 5);
  assert.equal(rules.fairness(stats, true).totalGap, 1);
});
test('bloque un démarrage incomplet et autorise un alignement prêt', () => {
  assert.equal(rules.startReadiness([], players).ok, false);
  assert.equal(rules.startReadiness(valid, players).ok, true);
});

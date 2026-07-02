const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load-browser-module');
const sync = load('team-sync.js', 'RallyeCapTeamSync');

test('choisit la version la plus récente', () => {
  assert.equal(sync.decideVersion(10,20), 'remote');
  assert.equal(sync.decideVersion(30,20), 'local');
  assert.equal(sync.decideVersion(20,20), 'equal');
});
test('regroupe les matchs privés sans doublon', () => {
  const local=[{teamId:'t1',cloud:{matchId:'m1'}},{teamId:'t2',cloud:{matchId:'m2'}}];
  const remote=[{id:'m1',teamId:'t1'},{id:'m3',payload:{teamId:'t1'}}];
  assert.deepEqual([...sync.privateMatchIds('t1',local,remote)].sort(), ['m1','m3']);
});

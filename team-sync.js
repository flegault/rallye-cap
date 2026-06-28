(function(root){
  'use strict';
  function decideVersion(localUpdatedAtMs,remoteUpdatedAtMs){
    let local=Number(localUpdatedAtMs)||0,remote=Number(remoteUpdatedAtMs)||0;
    if(remote>local)return'remote';
    if(local>remote)return'local';
    return'equal'
  }
  function privateMatchIds(teamId,localMatches,cloudMatches){
    let ids=new Set();
    (localMatches||[]).forEach(m=>{if(m?.teamId===teamId&&m?.cloud?.matchId)ids.add(m.cloud.matchId)});
    (cloudMatches||[]).forEach(doc=>{if((doc?.payload?.teamId||doc?.teamId)===teamId&&doc?.id)ids.add(doc.id)});
    return Array.from(ids)
  }
  root.RallyeCapTeamSync={decideVersion,privateMatchIds}
})(typeof window!=='undefined'?window:globalThis);

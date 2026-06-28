(function(root){
  const MISSIONS=['👏','🎉','🎵','🙌'];

  function positionCode(value){
    return String(value||'').trim().split(/\s+/)[0];
  }

  function phaseRows(view,phase){
    if(!phase)return[];
    if(phase.type==='attaque'){
      let rows=view?.batters?.[phase.inning]||[];
      if(!rows.length)rows=view?.battingOrder||[];
      return rows.map((row,index)=>({
        playerId:String(row.playerId||''),
        name:row.name||row.label||'—',
        number:String(row.number||''),
        rank:Number(row.rank)||index+1
      }));
    }
    return(view?.defense?.[phase.inning]||[]).map(row=>({
      playerId:String(row.playerId||''),
      name:row.name||row[1]||'—',
      number:String(row.number||''),
      position:positionCode(row.pos??row[0])
    }));
  }

  function missionFor(playerId,phaseIndex,index){
    return MISSIONS[Number(phaseIndex||0)%MISSIONS.length];
  }

  function phaseModel(view,phase){
    if(!phase)return null;
    return{type:phase.type,label:phase.label||'',inning:Number(phase.inning)||0,rows:phaseRows(view,phase)};
  }

  function benchForPhase(active,phase,phaseIndex){
    if(!phase)return[];
    let busy=new Set(phase.rows.map(row=>row.playerId).filter(Boolean));
    return active.filter(player=>!busy.has(String(player.playerId||''))).map((player,index)=>({
      playerId:String(player.playerId||''),name:player.name||player.label||'—',number:String(player.number||''),mission:missionFor(player.playerId,phaseIndex,index)
    }));
  }

  function buildModel(view){
    view=view||{};
    let base={team:view.team||'Équipe',opp:view.opp||'',status:'waiting',current:null,next:null,currentBench:[],nextBench:[]};
    if(!view.started)return base;
    let phases=Array.isArray(view.phases)?view.phases:[],currentIndex=Math.max(0,Number(view.currentIndex)||0);
    if(currentIndex>=phases.length){base.status='final';return base}
    base.status='playing';base.current=phaseModel(view,phases[currentIndex]);base.next=phaseModel(view,phases[currentIndex+1]);
    let active=view?.programme?.players||view.battingOrder||[];
    base.currentBench=benchForPhase(active,base.current,currentIndex);
    base.nextBench=benchForPhase(active,base.next,currentIndex+1);
    return base;
  }

  root.RallyeCapBench={MISSIONS,positionCode,phaseRows,missionFor,benchForPhase,buildModel};
})(window);

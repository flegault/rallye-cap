(function(global){
'use strict';

const POSITIONS=['1B','2B','3B','AC','L1','L2'];
const PITCH=new Set(['L1','L2']);

function cleanPositions(pos, playerIds){
  const ids=new Set((Array.isArray(playerIds)?playerIds:[]).map(String));
  const cleaned={};

  if(!pos||typeof pos!=='object')return cleaned;

  Object.entries(pos).forEach(([id,value])=>{
    const playerId=String(id);
    const position=String(value||'');
    if(ids.has(playerId)&&POSITIONS.includes(position)){
      cleaned[playerId]=position;
    }
  });

  return cleaned;
}

function scheduleRuleSummary(schedule, playerIds){
  const ids=Array.isArray(playerIds)?playerIds.map(String):[];
  const idSet=new Set(ids);
  const innings=Array.isArray(schedule)?schedule:[];
  const defense=[];
  const bench=[];
  const firstBase=[];
  const pitch=[];

  innings.forEach((inning,index)=>{
    const pos=(inning&&inning.pos&&typeof inning.pos==='object')?inning.pos:{};
    const entries=Object.entries(pos).filter(([id])=>idSet.has(String(id)));
    const usedPositions=entries.map(([,value])=>String(value));
    const uniquePositions=new Set(usedPositions);

    if(entries.length!==6){
      defense.push({rule:'defense-count',inning:index});
    }

    if(uniquePositions.size!==entries.length){
      defense.push({rule:'position-unique',inning:index});
    }

    usedPositions.forEach(value=>{
      if(!POSITIONS.includes(value)){
        defense.push({rule:'known-position',inning:index,position:value});
      }
    });
  });

  ids.forEach(id=>{
    const firstBaseInnings=[];
    innings.forEach((inning,index)=>{
      if(inning&&inning.pos&&inning.pos[id]==='1B')firstBaseInnings.push(index);
    });
    if(firstBaseInnings.length>1){
      firstBase.push({id,ins:firstBaseInnings});
    }

    for(let index=1;index<innings.length;index++){
      const prev=schedule[index-1]?.pos?.[id];
      const curr=schedule[index]?.pos?.[id];
      if(!prev&&!curr){
        bench.push({id,i:index});
      }
      if(PITCH.has(prev)&&PITCH.has(curr)){
        pitch.push({id,i:index});
      }
    }
  });

  return {defense,bench,firstBase,pitch};
}

function validateSchedule(schedule, playerIds){
  const summary=scheduleRuleSummary(schedule,playerIds);
  const violations=[];

  summary.defense.forEach(item=>{
    const messages={
      'defense-count':'Chaque manche doit avoir exactement 6 défenseurs.',
      'position-unique':'Chaque position défensive doit être assignée une seule fois par manche.',
      'known-position':'Position défensive inconnue: '+item.position+'.'
    };
    violations.push({rule:item.rule,inning:item.inning,message:messages[item.rule]});
  });

  summary.firstBase.forEach(item=>{
    violations.push({rule:'first-base-once',playerId:item.id,innings:item.ins,message:'Un joueur peut jouer 1B au maximum une fois.'});
  });

  summary.bench.forEach(item=>{
    violations.push({rule:'bench-consecutive',playerId:item.id,innings:[item.i-1,item.i],message:'Un joueur ne peut pas être au banc deux manches consécutives.'});
  });

  summary.pitch.forEach(item=>{
    violations.push({rule:'pitch-consecutive',playerId:item.id,innings:[item.i-1,item.i],message:'Un joueur ne peut pas être lanceur deux manches consécutives.'});
  });

  return {ok:violations.length===0,violations};
}

function startReadiness(schedule, playerIds){
  const ids=Array.isArray(playerIds)?playerIds.map(String):[];
  const idSet=new Set(ids);

  if(ids.length<6||ids.length>12){
    return {ok:false,text:'Active entre 6 et 12 joueurs avant de commencer.'};
  }

  for(let index=0;index<(Array.isArray(schedule)?schedule.length:0);index++){
    const inning=schedule[index]||{};
    const pos=(inning.pos&&typeof inning.pos==='object')?inning.pos:{};
    const assigned=Object.entries(pos).filter(([id,value])=>idSet.has(String(id))&&POSITIONS.includes(String(value)));
    const uniquePositions=new Set(assigned.map(([,value])=>String(value)));

    if(assigned.length!==6||uniquePositions.size!==6){
      return {ok:false,text:'Chaque manche doit avoir les 6 positions défensives assignées avant de commencer.'};
    }
  }

  return {ok:true,text:''};
}

global.RallyeCapRules={POSITIONS,cleanPositions,validateSchedule,scheduleRuleSummary,startReadiness};
})(window);

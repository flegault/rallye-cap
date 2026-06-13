(function(global){
'use strict';

const POSITIONS=['1B','2B','3B','AC','L1','L2'];
const PITCH=new Set(['L1','L2']);

function validateSchedule(schedule, playerIds){
  const ids=Array.isArray(playerIds)?playerIds.map(String):[];
  const idSet=new Set(ids);
  const violations=[];

  (Array.isArray(schedule)?schedule:[]).forEach((inning,index)=>{
    const pos=(inning&&inning.pos&&typeof inning.pos==='object')?inning.pos:{};
    const entries=Object.entries(pos).filter(([id])=>idSet.has(String(id)));
    const usedPositions=entries.map(([,value])=>String(value));
    const uniquePositions=new Set(usedPositions);

    if(entries.length!==6){
      violations.push({rule:'defense-count',inning:index,message:'Chaque manche doit avoir exactement 6 défenseurs.'});
    }

    if(uniquePositions.size!==entries.length){
      violations.push({rule:'position-unique',inning:index,message:'Chaque position défensive doit être assignée une seule fois par manche.'});
    }

    usedPositions.forEach(value=>{
      if(!POSITIONS.includes(value)){
        violations.push({rule:'known-position',inning:index,message:'Position défensive inconnue: '+value+'.'});
      }
    });
  });

  ids.forEach(id=>{
    const firstBaseInnings=[];
    (Array.isArray(schedule)?schedule:[]).forEach((inning,index)=>{
      if(inning&&inning.pos&&inning.pos[id]==='1B')firstBaseInnings.push(index);
    });
    if(firstBaseInnings.length>1){
      violations.push({rule:'first-base-once',playerId:id,innings:firstBaseInnings,message:'Un joueur peut jouer 1B au maximum une fois.'});
    }

    for(let index=1;index<(Array.isArray(schedule)?schedule.length:0);index++){
      const prev=schedule[index-1]?.pos?.[id];
      const curr=schedule[index]?.pos?.[id];
      if(!prev&&!curr){
        violations.push({rule:'bench-consecutive',playerId:id,innings:[index-1,index],message:'Un joueur ne peut pas être au banc deux manches consécutives.'});
      }
      if(PITCH.has(prev)&&PITCH.has(curr)){
        violations.push({rule:'pitch-consecutive',playerId:id,innings:[index-1,index],message:'Un joueur ne peut pas être lanceur deux manches consécutives.'});
      }
    }
  });

  return {ok:violations.length===0,violations};
}

global.RallyeCapRules={POSITIONS,validateSchedule};
})(window);

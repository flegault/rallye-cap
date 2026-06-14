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

function emptyStats(){
  return {ab:0,def:0,total:0,bench:0,pos:{'1B':0,'2B':0,'3B':0,'AC':0,'L1':0,'L2':0}};
}

function collectStats(schedule, playerIds, batterCounts, fixed){
  const ids=Array.isArray(playerIds)?playerIds.map(String):[];
  const counts=batterCounts&&typeof batterCounts==='object'?batterCounts:{};
  const stats={};

  ids.forEach(id=>{
    stats[id]=emptyStats();
    stats[id].ab=Number(counts[id]||0);
  });

  (Array.isArray(schedule)?schedule:[]).forEach(inning=>{
    const pos=(inning&&inning.pos&&typeof inning.pos==='object')?inning.pos:{};
    ids.forEach(id=>{
      const position=pos[id];
      if(POSITIONS.includes(position)){
        stats[id].def++;
        stats[id].pos[position]=(stats[id].pos[position]||0)+1;
      }else{
        stats[id].bench++;
      }
    });
  });

  Object.values(stats).forEach(item=>{
    item.total=fixed?item.ab+item.def:item.def;
  });

  return stats;
}

function fairness(stats, fixed){
  const values=Object.values(stats||{});
  if(!values.length)return{abGap:0,defGap:0,totalGap:0,posGap:0,overall:0,abScore:0,defScore:0,totalScore:0,posScore:0};

  const gap=items=>Math.max(...items)-Math.min(...items);
  const score=(gapValue,ideal)=>gapValue<=ideal?100:Math.max(0,Math.round(100-(gapValue-ideal)*18));
  const abGap=fixed?gap(values.map(item=>item.ab)):0;
  const defGap=gap(values.map(item=>item.def));
  const totalGap=gap(values.map(item=>item.total));
  const allPositions=[];

  values.forEach(item=>POSITIONS.forEach(position=>allPositions.push(item.pos[position]||0)));

  const posGap=gap(allPositions);
  const abScore=fixed?score(abGap,1):0;
  const defScore=score(defGap,2);
  const totalScore=score(totalGap,1);
  const posScore=score(posGap,3);
  const overall=fixed?Math.round(abScore*.30+totalScore*.40+posScore*.30):Math.round(totalScore*.60+posScore*.40);

  return {abGap,defGap,totalGap,posGap,overall,abScore,defScore,totalScore,posScore};
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

global.RallyeCapRules={POSITIONS,cleanPositions,emptyStats,collectStats,fairness,validateSchedule,scheduleRuleSummary,startReadiness};
})(window);

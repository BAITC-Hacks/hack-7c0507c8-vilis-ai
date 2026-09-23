import {districts,keys} from './data';
import {byInitiative} from './catalog';
import {scoreCity,type CityState} from './scoring';
import {scenarioSchema,costOf,type Decision} from './validation';
import {interactions,type Effect} from './interactions';
export function simulate(input:Decision[]) {
 const ds=scenarioSchema.parse(input).sort((a,b)=>a.initiativeId.localeCompare(b.initiativeId));
 const baseline=Object.fromEntries(districts.map(d=>[d.id,{...d.metrics}])) as CityState;
 const state=structuredClone(baseline);
 const log:Effect[]=[];
 for(const d of ds){
  const initiative=byInitiative(d.initiativeId);
  for(const metric of keys){const delta=initiative.variants[d.scale].effects[metric];if(delta)log.push({id:`direct-${d.initiativeId}-${metric}`,districtId:d.districtId,metric,delta,reason:initiative.name,kind:'direct'});}
 }
 log.push(...interactions(ds));
 for(const e of log)state[e.districtId][e.metric]+=e.delta;
 for(const d of districts)for(const k of keys){
  const raw=state[d.id][k];const clamped=Math.min(100,Math.max(0,raw));
  if(raw!==clamped)log.push({id:`clamp-${d.id}-${k}`,districtId:d.id,metric:k,delta:clamped-raw,reason:'Ограничение индекса диапазоном 0–100',kind:'clamp'});
  state[d.id][k]=clamped;
 }
 return {...scoreCity(state),baseline,state,log,cost:costOf(ds),maintenance:ds.reduce((s,d)=>s+byInitiative(d.initiativeId).variants[d.scale].maintenance,0)};
}
export type Simulation=ReturnType<typeof simulate>;
export const baselineResult=simulate([]);
export function shapley(ds:Decision[]) {
 const n=ds.length,cache=new Map<number,number>();
 for(let mask=0;mask<1<<n;mask++)cache.set(mask,simulate(ds.filter((_,i)=>mask&(1<<i))).score);
 const factorial=(v:number):number=>v<2?1:v*factorial(v-1);
 return ds.map((d,i)=>{
  let value=0;
  for(let mask=0;mask<1<<n;mask++)if(!(mask&(1<<i))){
   const size=mask.toString(2).replaceAll('0','').length;
   value+=factorial(size)*factorial(n-size-1)/factorial(n)*(cache.get(mask|(1<<i))!-cache.get(mask)!);
  }
  return {decision:d,value};
 });
}

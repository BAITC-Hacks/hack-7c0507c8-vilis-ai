import {describe,it,expect} from 'vitest';
import {BUDGET,districts,keys,weights,DATASET_VERSION} from '../lib/akim/data';
import {catalog} from '../lib/akim/catalog';
import {simulate,baselineResult,shapley} from '../lib/akim/simulation';
import {scenarioSchema,completeSchema,replaceDecision,costOf,type Decision} from '../lib/akim/validation';
import {findAlternative} from '../lib/akim/alternatives';
import {initialState,restore,demo} from '../lib/akim/storage';
import {analyze,localAnalysis} from '../lib/akim/advisor';
import {createProvider} from '../lib/akim/provider';
const d=(initiativeId:string,districtId:Decision['districtId']='industrial',scale:Decision['scale']='local'):Decision=>({initiativeId,districtId,scale});
describe('AKIM deterministic model',()=>{
 it('preserves baseline and calculates the specified weighted score',()=>{const r=simulate([]);for(const district of districts)expect(r.state[district.id]).toEqual(district.metrics);expect(r.score).toBeCloseTo(50.2552,3);expect(Object.values(weights).reduce((a,b)=>a+b,0)).toBe(1);});
 it('is deterministic, order-independent, and does not mutate inputs',()=>{const snapshot=JSON.stringify(demo);expect(simulate(demo)).toEqual(simulate([...demo].reverse()));expect(simulate(demo)).toEqual(simulate(demo));expect(JSON.stringify(demo)).toBe(snapshot);});
 it('keeps indexes in bounds including saturation',()=>{const ds=[d('routes','center','extended'),d('hub','center','extended'),d('spaces','center','local'),d('yards','center','local'),d('waste','center','local')];const r=simulate(ds);expect(r.state.center.social).toBe(100);expect(r.log.some(e=>e.kind==='clamp')).toBe(true);for(const state of Object.values(r.state))for(const k of keys)expect(state[k]).toBeGreaterThanOrEqual(0);expect(r.score).toBeLessThanOrEqual(100);});
 it('blocks over-budget plans and duplicate directions',()=>{expect(scenarioSchema.safeParse([d('routes','north','extended'),d('park','north','extended'),d('hub','north','extended'),d('spaces','north','extended'),d('repair','north','extended')]).success).toBe(false);expect(scenarioSchema.safeParse([d('bus'),d('stops')]).success).toBe(false);});
 it('replaces existing cost instead of charging twice',()=>{const after=replaceDecision(demo,d('stops','south','local'));expect(after).toHaveLength(5);expect(costOf(after)).toBe(costOf(demo)-18e6+8e6);});
 it('requires exactly five valid directions',()=>{expect(completeSchema.safeParse(demo).success).toBe(true);expect(completeSchema.safeParse(demo.slice(1)).success).toBe(false);expect(scenarioSchema.safeParse([{...d('bus'),initiativeId:'fake'}]).success).toBe(false);expect(scenarioSchema.safeParse([{...d('bus'),scale:'infinite'}]).success).toBe(false);});
 it('applies only co-located positive synergies once',()=>{const r=simulate([d('shade'),d('lights')]);expect(r.log.filter(e=>e.kind==='interaction')).toHaveLength(1);expect(r.state.industrial.safety).toBe(42+1+11+3);expect(simulate([d('shade'),d('lights','north')]).log.filter(e=>e.kind==='interaction')).toHaveLength(0);expect(simulate([d('access'),d('crossings')]).state.industrial.social).toBe(39+9+1+3);});
 it('uses baseline service and removes maintenance penalty only with local service investment',()=>{const green=d('park','industrial','extended');const r=simulate([green]);expect(r.log.find(e=>e.kind==='interaction')?.delta).toBeCloseTo(-14*2.35*.3);expect(simulate([green,d('waste')]).log.filter(e=>e.kind==='interaction')).toHaveLength(0);expect(simulate([green,d('waste','north')]).log.filter(e=>e.kind==='interaction')).toHaveLength(1);});
 it('returns a feasible, strictly better one-decision alternative',()=>{const a=findAlternative(demo)!;expect(a).not.toBeNull();expect(completeSchema.safeParse(a.decisions).success).toBe(true);expect(a.result.cost).toBeLessThanOrEqual(BUDGET);expect(a.result.score).toBeGreaterThan(simulate(demo).score);expect(a.decisions.filter((v,i)=>JSON.stringify(v)!==JSON.stringify(demo[i]))).toHaveLength(1);});
 it('Shapley contributions sum to actual score change with synergies',()=>{expect(shapley(demo).reduce((s,c)=>s+c.value,0)).toBeCloseTo(simulate(demo).score-baselineResult.score,10);});
 it('all category cheapest options fit while all maximum options do not',()=>{expect(keys.reduce((s,k)=>s+Math.min(...catalog.filter(c=>c.category===k).map(c=>c.variants.local.cost)),0)).toBeLessThan(BUDGET);expect(keys.reduce((s,k)=>s+Math.min(...catalog.filter(c=>c.category===k).map(c=>c.variants.extended.cost)),0)).toBeGreaterThan(BUDGET);});
 it('restores only validated compatible state',()=>{expect(restore(JSON.stringify(initialState))).toEqual(initialState);for(const bad of ['{','null',JSON.stringify({...initialState,datasetVersion:'old'}),JSON.stringify({...initialState,decisions:[d('fake')]})])expect(restore(bad)).toBeNull();expect(DATASET_VERSION).toBe('astana-demo-v1');});
});
describe('advisor contract',()=>{
 it('falls back without key and after timeout/error',async()=>{expect(createProvider({})).toBeUndefined();expect((await analyze(demo)).mode).toBe('local');expect((await analyze(demo,{generate:async()=>{throw new Error('timeout');}})).mode).toBe('local');});
 it('rejects malformed output and invented evidence',async()=>{expect((await analyze(demo,{generate:async()=>({bad:true})})).mode).toBe('local');const a=localAnalysis(demo);a.strengths[0].evidenceIds=['fiction'];expect((await analyze(demo,{generate:async()=>a})).mode).toBe('local');});
 it('accepts a valid provider response and rejects invalid server input',async()=>{expect((await analyze(demo,{generate:async()=>localAnalysis(demo)})).mode).toBe('ai');await expect(analyze(demo.slice(1))).rejects.toThrow();});
});


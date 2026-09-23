import {districts,keys,weights,type Metrics,type DistrictId,zero} from './data';
export type CityState = Record<DistrictId,Metrics>;
export const quality = (m:Metrics) => keys.reduce((v,k)=>v+m[k]*weights[k],0);
export function scoreCity(state:CityState) {
 const population=districts.reduce((s,d)=>s+d.population,0);
 const districtScores=Object.fromEntries(districts.map(d=>[d.id,quality(state[d.id])])) as Record<DistrictId,number>;
 const mean=districts.reduce((s,d)=>s+districtScores[d.id]*d.population/population,0);
 const weakest=districts.reduce((a,b)=>districtScores[a.id]<=districtScores[b.id]?a:b).id;
 const minimum=districtScores[weakest];
 const cityMetrics=zero();
 keys.forEach(k=>cityMetrics[k]=districts.reduce((s,d)=>s+state[d.id][k]*d.population/population,0));
 return {score:.8*mean+.2*minimum,mean,minimum,weakest,gap:Math.max(...Object.values(districtScores))-minimum,districtScores,cityMetrics};
}

'use client';
import {districts,type DistrictId,type Metric,keys} from '@/lib/akim/data';
import {type Simulation,baselineResult} from '@/lib/akim/simulation';
import {type Decision} from '@/lib/akim/validation';
import {byInitiative} from '@/lib/akim/catalog';
export function CityMap({result=baselineResult,selected,onSelect,layer='quality',decisions=[]}:{result?:Simulation;selected?:DistrictId;onSelect?:(id:DistrictId)=>void;layer?:Metric|'quality';decisions?:Decision[]}){
 return <svg className="city-map" viewBox="0 0 760 620" aria-label="Схематичная карта шести условных районов" role={onSelect?"group":"img"}>
  <defs><pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#263445" strokeWidth=".6"/></pattern><pattern id="blocks" width="34" height="30" patternTransform="rotate(-16)" patternUnits="userSpaceOnUse"><rect x="5" y="5" width="21" height="16" rx="2" fill="#a9c4d1" opacity=".09"/></pattern></defs>
  <rect width="760" height="620" fill="url(#map-grid)" opacity=".55"/>
  <path d="M-20 178 C135 211 130 277 264 242 S367 224 444 249 S574 292 790 228" fill="none" stroke="#162f43" strokeWidth="21"/>
  <path d="M-20 178 C135 211 130 277 264 242 S367 224 444 249 S574 292 790 228" fill="none" stroke="#35607c" strokeWidth="2"/>
  {districts.map((d,index)=>{
   const v=layer==='quality'?result.districtScores[d.id]:result.state[d.id][layer];
   const previous=layer==='quality'?baselineResult.districtScores[d.id]:d.metrics[layer];
   const chosen=selected===d.id;
   return <g key={d.id} className={`district-shape ${chosen?'selected':''}`} role={onSelect?'button':undefined} tabIndex={onSelect?0:undefined} aria-label={`${d.name}, индекс ${v.toFixed(1)}`} aria-pressed={onSelect?chosen:undefined} onClick={()=>onSelect?.(d.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect?.(d.id);}}}>
    <path d={d.path} fill={`hsl(${160+(v-50)*.35} 24% ${13+v*.105}%)`} stroke={chosen?'#4DE0C1':'#456071'} strokeWidth={chosen?2.5:1}/><path d={d.path} fill="url(#blocks)" pointerEvents="none"/>
    <g transform={`translate(${d.position[0]},${d.position[1]})`} pointerEvents="none"><text y="-26" className="map-number">0{index+1}</text><text className="map-name">{d.name}</text><text y="29" className="map-score">{v.toFixed(1)}<tspan className="map-delta">{v>previous?`  +${(v-previous).toFixed(1)}`:''}</tspan></text></g>
   </g>;
  })}
  <g fill="none" stroke="#b8c4cd" strokeOpacity=".24" strokeWidth="3" pointerEvents="none"><path d="M146 111 L286 217 L329 322 L386 545"/><path d="M87 365 L281 318 L492 311 L668 361"/><path d="M450 106 L423 233 L471 434 L539 536"/></g>
  {decisions.map(d=>{const district=districts.find(x=>x.id===d.districtId)!;const n=keys.indexOf(byInitiative(d.initiativeId).category);return <g key={d.initiativeId} transform={`translate(${district.position[0]-42+n*21},${district.position[1]+51})`} pointerEvents="none"><circle r="8" fill="#4DE0C1"/><text textAnchor="middle" y="4" fontSize="10" fill="#081816" fontWeight="700">{n+1}</text></g>;})}
  <g transform="translate(709 64)" fill="#A0B0C2"><text textAnchor="middle" y="-22" fontSize="12">С</text><path d="M0 -14L5 5L0 1L-5 5Z"/><path d="M0 7V25" stroke="currentColor"/></g>
  <text x="30" y="591" fill="#8399AD" fontSize="12">СХЕМА ГОРОДА / НЕ ГЕОГРАФИЧЕСКАЯ КАРТА</text>
 </svg>;
}


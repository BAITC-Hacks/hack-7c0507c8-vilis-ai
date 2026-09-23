import {byDistrict,type DistrictId,type Metric} from './data';
import {byInitiative} from './catalog';
import {type Decision} from './validation';
export type Effect={id:string;districtId:DistrictId;metric:Metric;delta:number;reason:string;kind:'direct'|'interaction'|'clamp'};
export function interactions(ds:Decision[]):Effect[] {
 const events:Effect[]=[];
 for(const districtId of [...new Set(ds.map(d=>d.districtId))].sort()) {
  const local=ds.filter(d=>d.districtId===districtId);
  const has=(id:string)=>local.some(d=>d.initiativeId===id);
  if(has('shade')&&has('lights'))events.push({id:`synergy-shade-${districtId}`,districtId,metric:'safety',delta:3,kind:'interaction',reason:'Тенистый маршрут и освещение: безопасная связная прогулочная зона.'});
  if(has('access')&&has('crossings'))events.push({id:`synergy-access-${districtId}`,districtId,metric:'social',delta:3,kind:'interaction',reason:'Доступная среда и переходы: удобный путь к социальным объектам.'});
  const green=local.find(d=>byInitiative(d.initiativeId).category==='greenery'&&d.scale==='extended');
  if(green&&byDistrict(districtId).metrics.services<50&&!local.some(d=>byInitiative(d.initiativeId).category==='services'))events.push({id:`maintenance-${districtId}`,districtId,metric:'greenery',delta:-byInitiative(green.initiativeId).variants.extended.effects.greenery*.3,kind:'interaction',reason:'Сервис ниже 50 без улучшения: потеря 30% основного эффекта расширенного озеленения.'});
 }
 return events;
}

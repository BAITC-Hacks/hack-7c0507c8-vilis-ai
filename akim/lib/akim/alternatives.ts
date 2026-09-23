import {catalog,byInitiative} from './catalog';
import {districts,scales,BUDGET} from './data';
import {completeSchema,costOf,type Decision} from './validation';
import {simulate} from './simulation';
export function findAlternative(input:Decision[]) {
 const ds=completeSchema.parse(input);
 const initial=simulate(ds);
 let best:{decisions:Decision[];result:ReturnType<typeof simulate>;before:Decision;after:Decision}|null=null;
 for(let index=0;index<ds.length;index++)for(const initiative of catalog.filter(i=>i.category===byInitiative(ds[index].initiativeId).category))for(const district of districts)for(const scale of scales){
  const after:Decision={initiativeId:initiative.id,districtId:district.id,scale};
  const candidate=ds.map((d,i)=>i===index?after:d);
  if(costOf(candidate)>BUDGET)continue;
  const result=simulate(candidate);
  if(result.score>(best?.result.score??initial.score)+1e-9)best={decisions:candidate,result,before:ds[index],after};
 }
 return best;
}

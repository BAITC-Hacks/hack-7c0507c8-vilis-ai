import {z} from 'zod';
import {BUDGET,districtIds,scales,keys} from './data';
import {byInitiative,catalog} from './catalog';
export const decisionSchema=z.object({initiativeId:z.string().refine(v=>catalog.some(i=>i.id===v),'Неизвестная инициатива'),districtId:z.enum(districtIds),scale:z.enum(scales)}).strict();
export type Decision=z.infer<typeof decisionSchema>;
export const scenarioSchema=z.array(decisionSchema).max(5).superRefine((ds,ctx)=>{
 if(ds.some(d=>!byInitiative(d.initiativeId)))return;
 const cats=ds.map(d=>byInitiative(d.initiativeId).category);
 if(new Set(cats).size!==cats.length)ctx.addIssue({code:'custom',message:'Одно решение на направление'});
 if(costOf(ds)>BUDGET)ctx.addIssue({code:'custom',message:'Превышен бюджет'});
});
export const completeSchema=scenarioSchema.refine(ds=>ds.length===keys.length,'Примите все пять решений');
export const costOf=(ds:Decision[])=>ds.reduce((s,d)=>s+byInitiative(d.initiativeId).variants[d.scale].cost,0);
export function replaceDecision(ds:Decision[],next:Decision) {
 decisionSchema.parse(next);
 const category=byInitiative(next.initiativeId).category;
 return [...ds.filter(d=>byInitiative(d.initiativeId).category!==category),next];
}

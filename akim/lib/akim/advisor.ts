import {z} from 'zod';
import {byDistrict,DATASET_VERSION,MODEL_VERSION,BUDGET,districts} from './data';
import {byInitiative} from './catalog';
import {type Decision,completeSchema} from './validation';
import {simulate,baselineResult} from './simulation';
import {findAlternative} from './alternatives';
const evidence=z.array(z.string()).min(1).max(10);
export const analysisSchema=z.object({summary:z.string().min(1).max(1500),strengths:z.array(z.object({title:z.string(),explanation:z.string(),evidenceIds:evidence})).min(1).max(4),tradeoffs:z.array(z.object({title:z.string(),explanation:z.string(),districtIds:z.array(z.string()),evidenceIds:evidence})).min(1).max(4),alternativeExplanation:z.string(),defenseQuestion:z.string(),limitations:z.array(z.string()).min(1)});
export type Analysis=z.infer<typeof analysisSchema>;
export function localAnalysis(ds:Decision[]):Analysis {
 const r=simulate(ds),weak=byDistrict(r.weakest),a=findAlternative(ds);
 const best=districts.reduce((x,y)=>r.districtScores[x.id]-baselineResult.districtScores[x.id]>=r.districtScores[y.id]-baselineResult.districtScores[y.id]?x:y);
 return {summary:'Стратегия улучшает выбранные направления, но общий результат зависит и от положения самого слабого района. Сравните распределение эффекта, прежде чем защищать бюджет.',strengths:[{title:`Наибольший прирост: ${best.name}`,explanation:'Здесь мероприятия дают максимальное изменение районного индекса относительно исходного состояния.',evidenceIds:[`district-${best.id}`]}],tradeoffs:[{title:`В центре внимания: ${weak.name}`,explanation:'Этот район остаётся самым слабым после реализации стратегии. Его результат влияет на пятую часть городского Score.',districtIds:[weak.id],evidenceIds:[`district-${weak.id}`]}],alternativeExplanation:a?`Проверьте замену «${byInitiative(a.before.initiativeId).name}» на «${byInitiative(a.after.initiativeId).name}» в районе ${byDistrict(a.after.districtId).name}. Она повышает рассчитанный Score, но меняет распределение пользы.`:'Среди допустимых замен одного решения улучшение не найдено. Это не доказывает глобальную оптимальность.',defenseQuestion:`Как вы объясните жителям района «${weak.name}», почему после вашей смены он остаётся самым уязвимым?`,limitations:['Синтетические данные и условные коэффициенты.','Горизонт — 12 месяцев. Это не прогноз для реальной Астаны.']};
}
export interface AdvisorProvider {generate(context:unknown):Promise<unknown>}
export async function analyze(input:unknown,provider?:AdvisorProvider){
 const ds=completeSchema.parse(input),result=simulate(ds),alternative=findAlternative(ds);
 const evidenceIds=new Set(['summary','alternative',...districts.map(d=>`district-${d.id}`),...result.log.map(e=>e.id)]);
 const fallback=()=>({mode:'local' as const,analysis:localAnalysis(ds)});
 if(!provider)return fallback();
 try{
  const analysis=analysisSchema.parse(await provider.generate({datasetVersion:DATASET_VERSION,modelVersion:MODEL_VERSION,budget:BUDGET,baseline:baselineResult,decisions:ds.map(d=>({...d,initiative:byInitiative(d.initiativeId)})),result,alternative,evidenceIds:[...evidenceIds],limitations:['Учебная модель, не реальные данные.','Не пересчитывай и не придумывай числа.']}));
  if([...analysis.strengths,...analysis.tradeoffs].some(s=>s.evidenceIds.some(id=>!evidenceIds.has(id)))||analysis.tradeoffs.some(t=>t.districtIds.some(id=>!districts.some(d=>d.id===id))))return fallback();
  return {mode:'ai' as const,analysis};
 }catch{return fallback();}
}

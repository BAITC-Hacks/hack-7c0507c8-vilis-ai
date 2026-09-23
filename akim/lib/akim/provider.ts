import type {AdvisorProvider} from './advisor';
export function createProvider(config:{key?:string;baseUrl?:string;model?:string}):AdvisorProvider|undefined {
 if(!config.key||!config.model)return;
 return {async generate(context){
  const response=await fetch(`${(config.baseUrl||'https://api.openai.com/v1').replace(/\/$/,'')}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.key}`},signal:AbortSignal.timeout(20000),body:JSON.stringify({model:config.model,response_format:{type:'json_object'},messages:[{role:'system',content:'Ты советник учебного симулятора AKIM. Пиши по-русски. Используй только переданные evidenceIds. Не пересчитывай и не придумывай числа. Верни JSON: summary:string, strengths:[{title,explanation,evidenceIds:string[]}], tradeoffs:[{title,explanation,districtIds:string[],evidenceIds:string[]}], alternativeExplanation:string, defenseQuestion:string, limitations:string[]. Не менее одного элемента в strengths, tradeoffs, limitations. Укажи слабейший район и компромиссы. Данные и коэффициенты синтетические. Альтернатива — только рассчитанная замена одного решения.'},{role:'user',content:JSON.stringify(context)}]})});
  if(!response.ok)throw new Error('Provider unavailable');
  const data=await response.json() as {choices?:{message?:{content?:string}}[]};
  return JSON.parse(data.choices?.[0]?.message?.content||'');
 }};
}

import {analyze} from '@/lib/akim/advisor';
import {createProvider} from '@/lib/akim/provider';
import {completeSchema} from '@/lib/akim/validation';
export async function POST(request:Request){
 try{
  const raw=await request.text();
  if(raw.length>10000)return Response.json({error:'Слишком большой запрос'},{status:413});
  const parsed=completeSchema.safeParse(JSON.parse(raw));
  if(!parsed.success)return Response.json({error:'Проверьте пять решений и бюджет'},{status:400});
  const provider=createProvider({key:process.env.AI_API_KEY,baseUrl:process.env.AI_BASE_URL,model:process.env.AI_MODEL});
  return Response.json(await analyze(parsed.data,provider),{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Некорректный запрос'},{status:400});}
}

export const DATASET_VERSION = 'astana-demo-v1';
export const MODEL_VERSION = 'akim-model-v1';
export const BUDGET = 100_000_000;
export const keys = ['transport','greenery','social','safety','services'] as const;
export type Metric = typeof keys[number];
export type Metrics = Record<Metric, number>;
export const labels: Record<Metric,string> = {transport:'Транспорт',greenery:'Озеленение',social:'Социальная инфраструктура',safety:'Безопасность',services:'Городской сервис'};
export const shortLabels: Record<Metric,string> = {...labels,social:'Социальная среда',services:'Сервис'};
export const colors: Record<Metric,string> = {transport:'#82B6FF',greenery:'#4DE0C1',social:'#BCABF8',safety:'#F4BD62',services:'#F09FB6'};
export const weights: Metrics = {transport:.25,greenery:.2,social:.25,safety:.15,services:.15};
export const districtIds = ['north','river','east','center','south','industrial'] as const;
export type DistrictId = typeof districtIds[number];
export type District = {id:DistrictId;name:string;population:number;metrics:Metrics;description:string;problems:string[];neighbors:DistrictId[];request:string;path:string;position:[number,number]};
const metrics = (v:number[]):Metrics => Object.fromEntries(keys.map((k,i)=>[k,v[i]])) as Metrics;
export const districts:District[] = [
 {id:'north',name:'Северный',population:180000,metrics:metrics([42,35,48,61,55]),description:'Растущий жилой район. Инфраструктура не успевает за новыми кварталами.',problems:['Мало зелёных маршрутов','Сложно добраться до центра'],neighbors:['river','center','industrial'],request:'Хотим добираться до работы без нескольких пересадок.',path:'M118 87 L291 45 L383 96 L366 206 L295 247 L156 218 L83 158 Z',position:[240,153]},
 {id:'river',name:'Прибрежный',population:220000,metrics:metrics([68,72,61,65,70]),description:'Благоустроенные кварталы у реки с высокой плотностью населения.',problems:['Нагрузка на социальные учреждения','Безопасность пешеходов'],neighbors:['north','east','center'],request:'Удобные переходы нужны даже в благоустроенном районе.',path:'M392 96 L498 64 L638 122 L658 228 L553 261 L465 223 L379 207 Z',position:[514,160]},
 {id:'east',name:'Восточный',population:160000,metrics:metrics([38,46,35,49,44]),description:'Новые жилые массивы с дефицитом социальных услуг и транспорта.',problems:['Мало мест в учреждениях','Недостаточно маршрутов'],neighbors:['river','center','south'],request:'Нужны дополнительные места в учреждениях рядом с домом.',path:'M562 278 L667 246 L709 342 L636 455 L543 432 L513 343 Z',position:[616,346]},
 {id:'center',name:'Центральный',population:140000,metrics:metrics([75,40,78,68,74]),description:'Деловое ядро города. Хорошая инфраструктура, но мало зелени.',problems:['Недостаток тени','Высокая транспортная нагрузка'],neighbors:['north','river','east','south','industrial'],request:'Летом очень не хватает тенистых улиц для прогулок.',path:'M304 262 L373 230 L461 245 L532 279 L488 345 L431 397 L302 367 L264 310 Z',position:[397,308]},
 {id:'south',name:'Южный',population:170000,metrics:metrics([51,58,43,54,48]),description:'Семейные кварталы с парками и растущим спросом на городские услуги.',problems:['Дефицит социальных объектов','Медленные городские сервисы'],neighbors:['center','east','industrial'],request:'Пусть заявки о поломках во дворах решаются быстрее.',path:'M300 390 L428 421 L494 368 L525 451 L616 478 L535 569 L381 581 L274 505 Z',position:[427,492]},
 {id:'industrial',name:'Промышленный',population:130000,metrics:metrics([47,24,39,42,46]),description:'Жилые кварталы рядом с производствами. Самые острые экологические и социальные потребности.',problems:['Низкий уровень озеленения','Небезопасные общественные пространства'],neighbors:['north','center','south'],request:'Нужны зелёные дворы и освещённые дороги к остановкам.',path:'M78 195 L153 240 L276 264 L240 313 L275 381 L249 493 L139 460 L59 336 Z',position:[159,345]},
];
export const scales = ['local','district','extended'] as const;
export type Scale = typeof scales[number];
export const scaleLabels:Record<Scale,string> = {local:'Локальный',district:'Районный',extended:'Расширенный'};
export const zero = ():Metrics => ({transport:0,greenery:0,social:0,safety:0,services:0});
export const byDistrict = (id:string) => districts.find(d=>d.id===id)!;

import {z} from 'zod';
import {byInitiative} from './catalog';
import {DATASET_VERSION,MODEL_VERSION,keys,districtIds} from './data';
import {scenarioSchema,decisionSchema,completeSchema,type Decision} from './validation';
export const STORAGE_KEY='akim-session-v1';
export const stateSchema=z.object({datasetVersion:z.literal(DATASET_VERSION),modelVersion:z.literal(MODEL_VERSION),started:z.boolean(),active:z.enum(keys),district:z.enum(districtIds),draft:decisionSchema,decisions:scenarioSchema,saved:z.array(z.object({name:z.string().max(80),decisions:completeSchema})).max(2)}).refine(s=>s.draft.districtId===s.district && byInitiative(s.draft.initiativeId)?.category===s.active,'Черновик другого района');
export type StoredState=z.infer<typeof stateSchema>;
export const initialState:StoredState={datasetVersion:DATASET_VERSION,modelVersion:MODEL_VERSION,started:false,active:'transport',district:'north',draft:{initiativeId:'bus',districtId:'north',scale:'local'},decisions:[],saved:[]};
export function restore(raw:string|null):StoredState|null{try{return raw?stateSchema.parse(JSON.parse(raw)):null;}catch{return null;}}
export const demo:Decision[]=[{initiativeId:'bus',districtId:'north',scale:'district'},{initiativeId:'shade',districtId:'center',scale:'district'},{initiativeId:'places',districtId:'east',scale:'district'},{initiativeId:'lights',districtId:'center',scale:'district'},{initiativeId:'waste',districtId:'south',scale:'district'}];


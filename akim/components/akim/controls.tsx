'use client';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
export function Picker({value,onChange,options,label}:{value:string;onChange:(s:string)=>void;options:{value:string;label:string}[];label:string}){
 return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="akim-select"><SelectValue/></SelectTrigger><SelectContent position="popper">{options.map(o=><SelectItem value={o.value} key={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;
}

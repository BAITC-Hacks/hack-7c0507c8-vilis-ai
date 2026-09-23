export const BUDGET = 100;

export const indicators = [
  { id: 'T1', name: 'Разгрузка дорог', domain: 'Транспорт', weight: 0.10 },
  { id: 'T2', name: 'Доступность общественного транспорта', domain: 'Транспорт', weight: 0.10 },
  { id: 'E1', name: 'Озеленение', domain: 'Экология', weight: 0.09 },
  { id: 'E2', name: 'Качество воздуха', domain: 'Экология', weight: 0.11 },
  { id: 'S1', name: 'Школы и детсады', domain: 'Соцсфера', weight: 0.11 },
  { id: 'S2', name: 'Поликлиники и первичная помощь', domain: 'Соцсфера', weight: 0.11 },
  { id: 'B1', name: 'Безопасность улиц', domain: 'Безопасность', weight: 0.09 },
  { id: 'B2', name: 'Безопасность движения', domain: 'Безопасность', weight: 0.09 },
  { id: 'C1', name: 'Надёжность ЖКХ', domain: 'Сервисы', weight: 0.10 },
  { id: 'C2', name: 'Скорость ответа жителям', domain: 'Сервисы', weight: 0.10 },
] as const;

export type IndicatorId = (typeof indicators)[number]['id'];
export type Domain = (typeof indicators)[number]['domain'];
export type Values = Record<IndicatorId, number>;
export type DistrictId = 'yesil' | 'almaty' | 'saryarka' | 'baikonur' | 'nura';
export type District = { id: DistrictId; name: string; population: number; values: Values };

const values = (numbers: number[]) => Object.fromEntries(indicators.map((indicator, index) => [indicator.id, numbers[index]])) as Values;

export const districts: District[] = [
  { id: 'yesil', name: 'Есиль', population: 0.27, values: values([45, 62, 68, 72, 48, 55, 78, 60, 75, 70]) },
  { id: 'almaty', name: 'Алматы', population: 0.24, values: values([40, 75, 50, 55, 60, 65, 62, 52, 50, 60]) },
  { id: 'saryarka', name: 'Сарыарка', population: 0.20, values: values([50, 70, 42, 40, 62, 68, 58, 55, 45, 55]) },
  { id: 'baikonur', name: 'Байконур', population: 0.13, values: values([52, 68, 55, 50, 58, 60, 52, 58, 55, 58]) },
  { id: 'nura', name: 'Нура', population: 0.16, values: values([55, 40, 45, 65, 38, 35, 55, 50, 60, 50]) },
];

export type Initiative = {
  id: string;
  domain: Domain;
  name: string;
  description: string;
  scope: 'district' | 'city';
  cost: number;
  lag: number;
  effects: Partial<Values>;
};

export const initiatives: Initiative[] = [
  { id: 'M1', domain: 'Транспорт', name: 'Выделенные полосы для автобусов', description: 'Приоритет общественного транспорта на загруженных улицах.', scope: 'district', cost: 18, lag: 2, effects: { T1: 6, T2: 9 } },
  { id: 'M2', domain: 'Транспорт', name: 'Умные светофоры', description: 'Адаптивное управление потоками снижает заторы и риск ДТП.', scope: 'city', cost: 22, lag: 2, effects: { T1: 4, B2: 3 } },
  { id: 'M3', domain: 'Транспорт', name: 'Линия ЛРТ / расширение', description: 'Новая пропускная способность общественного транспорта.', scope: 'district', cost: 30, lag: 4, effects: { T1: 16, T2: 20, E2: 4 } },
  { id: 'M4', domain: 'Экология', name: 'Парк или сквер', description: 'Зелёное общественное пространство в выбранном районе.', scope: 'district', cost: 15, lag: 2, effects: { E1: 12, E2: 3, B1: 2 } },
  { id: 'M5', domain: 'Экология', name: 'Чистое топливо для частного сектора', description: 'Меньше выбросов и выше надёжность коммунальных систем.', scope: 'district', cost: 25, lag: 3, effects: { E2: 14, C1: 4 } },
  { id: 'M6', domain: 'Экология', name: 'Городское озеленение и ветрозащитные полосы', description: 'Зелёный каркас и качество воздуха улучшаются во всём городе.', scope: 'city', cost: 20, lag: 4, effects: { E1: 5, E2: 3 } },
  { id: 'M7', domain: 'Соцсфера', name: 'Школа и детсад', description: 'Новые места в районах с дефицитом социальной инфраструктуры.', scope: 'district', cost: 24, lag: 3, effects: { S1: 16 } },
  { id: 'M8', domain: 'Соцсфера', name: 'Центр семейного здоровья', description: 'Больше доступа к первичной медицинской помощи.', scope: 'district', cost: 20, lag: 3, effects: { S2: 14 } },
  { id: 'M9', domain: 'Соцсфера', name: 'Дворовые спорт-хабы', description: 'Доступные спортивные пространства рядом с домом.', scope: 'district', cost: 10, lag: 1, effects: { S1: 3, S2: 3, B1: 3 } },
  { id: 'M10', domain: 'Безопасность', name: 'Освещение и камеры Safe City', description: 'Безопаснее улицы и дорожное движение в районе.', scope: 'district', cost: 12, lag: 1, effects: { B1: 12, B2: 2 } },
  { id: 'M11', domain: 'Безопасность', name: 'Безопасные переходы и школьные зоны', description: 'Меньше риска ДТП у школ и общественных объектов.', scope: 'district', cost: 10, lag: 1, effects: { B2: 12, T1: -2 } },
  { id: 'M12', domain: 'Сервисы', name: 'Цифровая платформа обращений', description: 'Быстрее обрабатываются обращения жителей всего города.', scope: 'city', cost: 14, lag: 1, effects: { C2: 5 } },
  { id: 'M13', domain: 'Сервисы', name: 'Модернизация тепло- и водосетей', description: 'Надёжнее коммунальные сети выбранного района.', scope: 'district', cost: 28, lag: 4, effects: { C1: 18, E2: 2 } },
  { id: 'M14', domain: 'Сервисы', name: 'Аварийные бригады и раннее оповещение', description: 'Быстрее реакция на коммунальные сбои во всём городе.', scope: 'city', cost: 16, lag: 1, effects: { C1: 5, C2: 2 } },
];

export type Decision = { initiativeId: string; districtId?: DistrictId };
export type Validation = { valid: boolean; errors: string[]; cost: number };
const initiativeMap = new Map(initiatives.map((item) => [item.id, item]));
const districtMap = new Map(districts.map((item) => [item.id, item]));

export function validateDecisions(decisions: Decision[]): Validation {
  const errors: string[] = [];
  const known = decisions.map((decision) => ({ decision, initiative: initiativeMap.get(decision.initiativeId) }));
  const cost = known.reduce((sum, item) => sum + (item.initiative?.cost ?? 0), 0);
  if (decisions.length !== 5) errors.push(`Выберите ровно 5 решений (сейчас ${decisions.length}).`);
  if (known.some((item) => !item.initiative)) errors.push('В наборе есть неизвестное мероприятие.');
  if (new Set(decisions.map((item) => item.initiativeId)).size !== decisions.length) errors.push('Повторно выбрать одно мероприятие нельзя.');
  if (cost > BUDGET) errors.push(`Превышен бюджет: ${cost} из ${BUDGET} у.е.`);
  for (const { decision, initiative } of known) {
    if (!initiative) continue;
    if (initiative.scope === 'district' && !decision.districtId) errors.push(`${initiative.id}: укажите район.`);
    if (initiative.scope === 'city' && decision.districtId) errors.push(`${initiative.id}: городская мера не требует выбора района.`);
    if (decision.districtId && !districtMap.has(decision.districtId)) errors.push(`${initiative.id}: неизвестный район.`);
  }
  const counts = new Map<Domain, number>();
  for (const { initiative } of known) if (initiative) counts.set(initiative.domain, (counts.get(initiative.domain) ?? 0) + 1);
  for (const [domain, count] of counts) if (count > 2) errors.push(`В направлении «${domain}» нельзя выбрать больше двух мер.`);
  const has = (id: string) => decisions.some((item) => item.initiativeId === id);
  const districtOf = (id: string) => decisions.find((item) => item.initiativeId === id)?.districtId;
  if (has('M1') && has('M3')) errors.push('M1 и M3 несовместимы: выберите автобусные полосы или ЛРТ.');
  if (has('M4') && has('M7') && districtOf('M4') === districtOf('M7')) errors.push('M4 и M7 нельзя разместить в одном районе: они используют один участок.');
  if (has('M5') && has('M13') && districtOf('M5') === districtOf('M13')) errors.push('M5 и M13 дублируют программу в одном районе.');
  return { valid: errors.length === 0, errors, cost };
}

function compute(decisions: Decision[]) {
  const before = Object.fromEntries(districts.map((district) => [district.id, { ...district.values }])) as Record<DistrictId, Values>;
  const after = Object.fromEntries(districts.map((district) => [district.id, { ...district.values }])) as Record<DistrictId, Values>;
  const deltas = Object.fromEntries(districts.map((district) => [district.id, Object.fromEntries(indicators.map((indicator) => [indicator.id, 0]))])) as Record<DistrictId, Values>;
  for (const decision of decisions) {
    const initiative = initiativeMap.get(decision.initiativeId)!;
    const targets = initiative.scope === 'city' ? districts.map((district) => district.id) : [decision.districtId!];
    const realized = (8 - initiative.lag) / 8;
    for (const districtId of targets) for (const [indicatorId, amount] of Object.entries(initiative.effects) as [IndicatorId, number][]) {
      deltas[districtId][indicatorId] += amount * realized;
    }
  }
  const synergies = [
    { first: 'M1', second: 'M2', indicator: 'T1' as const, amount: 2 },
    { first: 'M10', second: 'M12', indicator: 'B1' as const, amount: 2 },
    { first: 'M5', second: 'M6', indicator: 'E2' as const, amount: 2 },
  ];
  for (const synergy of synergies) {
    const first = decisions.find((decision) => decision.initiativeId === synergy.first);
    const second = decisions.find((decision) => decision.initiativeId === synergy.second);
    if (first?.districtId && second) deltas[first.districtId][synergy.indicator] += synergy.amount;
  }
  for (const district of districts) for (const indicator of indicators) {
    after[district.id][indicator.id] = Math.max(0, Math.min(100, before[district.id][indicator.id] + deltas[district.id][indicator.id]));
    deltas[district.id][indicator.id] = after[district.id][indicator.id] - before[district.id][indicator.id];
  }
  const districtScores = Object.fromEntries(districts.map((district) => [district.id, indicators.reduce((sum, indicator) => sum + after[district.id][indicator.id] * indicator.weight, 0)])) as Record<DistrictId, number>;
  const average = districts.reduce((sum, district) => sum + districtScores[district.id] * district.population, 0);
  const weakest = districts.reduce<{ id: DistrictId; score: number }>((current, district) => districtScores[district.id] < districtScores[current.id] ? { id: district.id, score: districtScores[district.id] } : current, { id: districts[0].id, score: districtScores[districts[0].id] });
  const criticalCount = districts.reduce((sum, district) => sum + indicators.filter((indicator) => after[district.id][indicator.id] < 40).length, 0);
  return { before, after, deltas, districtScores, average, minimum: weakest.score, weakestDistrict: weakest.id, criticalCount, score: 0.7 * average + 0.3 * weakest.score - criticalCount };
}

export const baselineResult = (() => {
  const result = compute([]);
  return { ...result, change: 0, cost: 0 };
})();

export function calculate(decisions: Decision[]) {
  const validation = validateDecisions(decisions);
  if (!validation.valid) throw new Error(validation.errors[0] ?? 'Невалидный набор решений.');
  const result = compute(decisions);
  return { ...result, change: result.score - baselineResult.score, cost: validation.cost, validation };
}

export const initialDecisions: Decision[] = [
  { initiativeId: 'M7', districtId: 'nura' },
  { initiativeId: 'M8', districtId: 'nura' },
  { initiativeId: 'M10', districtId: 'nura' },
  { initiativeId: 'M12' },
  { initiativeId: 'M5', districtId: 'saryarka' },
];

export const domainColors: Record<Domain, string> = {
  Транспорт: '#78aef9', Экология: '#60d6a8', Соцсфера: '#c6a6f7', Безопасность: '#f4bc63', Сервисы: '#ef92a7',
};


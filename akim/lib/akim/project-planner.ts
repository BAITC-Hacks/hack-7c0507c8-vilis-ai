export const projectDomains = ['Транспорт', 'Экология', 'Соцсфера', 'Безопасность', 'Сервисы'] as const;
export type ProjectDomain = (typeof projectDomains)[number];
export const projectDistricts = ['Есиль', 'Алматы', 'Сарыарка', 'Байконур', 'Нура', 'Весь город'] as const;
export type ProjectDistrict = (typeof projectDistricts)[number];

export type ProjectProfile = {
  defaultTitle: string;
  defaultProblem: string;
  scopeLabel: string;
  metricName: string;
  metricUnit: string;
  direction: 'lower' | 'higher';
  baselineExample: number;
  targetExample: number;
  baselineMethod: string;
  purpose: string;
  solution: string;
  beneficiaries: string;
  phaseActions: [string, string, string, string, string];
  pilotMethod: string;
  comparison: string;
  guardrail: string;
  goNoGo: string;
  technologies: { name: string; purpose: string; optional?: boolean }[];
  risks: { title: string; mitigation: string }[];
};

export const projectProfiles: Record<ProjectDomain, ProjectProfile> = {
  Транспорт: {
    defaultTitle: 'Адаптивные светофоры на школьных маршрутах',
    defaultProblem: 'Автобусы теряют время на перекрёстках, а фактические задержки по маршрутам пока не собраны в единую базовую линию.',
    scopeLabel: 'перекрёстков или участков',
    metricName: 'Медианное время проезда по пилотному коридору', metricUnit: 'мин', direction: 'lower', baselineExample: 34, targetExample: 28,
    baselineMethod: 'Сравнивать одинаковые часы пик и дни недели; отдельно учитывать автобусы и частный транспорт.',
    purpose: 'сократить задержки на выбранном коридоре, не перенося заторы на соседние улицы.',
    solution: 'Измерить потоки и расписание, настроить адаптивные фазы только на пилотных перекрёстках и сохранить ручной режим.',
    beneficiaries: 'пассажиры автобусов, водители и жители рядом с коридором.',
    phaseActions: ['Снять время поездки и очереди, утвердить исходную линию.', 'Проверить контроллеры, интеграции, безопасность и ручной возврат.', 'Подключить ограниченный пилот и обучить диспетчеров.', 'Повторить замеры; проверить соседние улицы и безопасность.', 'Расширять после проверки эффекта, расходов и готовности дорожной службы.'],
    pilotMethod: 'Снимите не менее четырёх недель замеров до запуска и повторите их после пилота в те же временные окна.',
    comparison: 'Сравните динамику с похожим коридором без изменений; фиксируйте ремонты, погоду и сезонность.',
    guardrail: 'Контролируйте задержки на соседних улицах, ожидание пешеходов и соблюдение расписания.',
    goNoGo: 'Расширяйте только при достижении KPI без ухудшения соседних улиц и с подтверждённым владельцем эксплуатации.',
    technologies: [
      { name: 'QGIS + PostGIS', purpose: 'карта коридора, перекрёстков и зон сравнения' },
      { name: 'Контроллеры + защищённый API', purpose: 'фазы светофоров, журнал событий и ручной режим' },
      { name: 'Счётчики или обезличенный видеоанализ', purpose: 'измерение потока без распознавания лиц и номеров' },
      { name: 'GTFS / AVL', purpose: 'сопоставление расписания и движения автобусов', optional: true },
    ],
    risks: [
      { title: 'Затор переместится', mitigation: 'Измерять соседние улицы и заранее задать предел ухудшения.' },
      { title: 'Нет доступа к контроллерам', mitigation: 'Проверить протокол и один тестовый узел до закупки.' },
      { title: 'Видео раскрывает личность', mitigation: 'Предпочесть счётчики; не хранить идентифицирующее видео.' },
    ],
  },
  Экология: {
    defaultTitle: 'Умный полив и контроль приживаемости зелёных зон',
    defaultProblem: 'Нет общего учёта полива и состояния насаждений по пилотным площадкам.',
    scopeLabel: 'зелёных площадок или участков',
    metricName: 'Доля насаждений, переживших первый сезон', metricUnit: '%', direction: 'higher', baselineExample: 72, targetExample: 85,
    baselineMethod: 'Считать выжившие растения по реестру посадок и осмотреть те же площадки после сезона.',
    purpose: 'снизить потери новых насаждений и расход воды, связав посадки с регулярным уходом.',
    solution: 'Создать GIS-реестр зелёных активов, пилотировать датчики влажности и маршрут ухода, затем проверить приживаемость.',
    beneficiaries: 'жители кварталов, служба озеленения и подрядчики по уходу.',
    phaseActions: ['Сверить реестр, состояние почвы и похожие площадки.', 'Согласовать виды растений, полив, воду и эксплуатацию.', 'Развернуть пилот датчиков и закрепить ответственных за уход.', 'Проверить приживаемость и расход воды после сезона.', 'Расширять только при подтверждённом эффекте и бюджете ухода.'],
    pilotMethod: 'Зафиксируйте состав посадок до старта и осмотрите те же растения после полного сезона.',
    comparison: 'Сопоставьте с площадками обычного полива, похожими видами растений и условиями.',
    guardrail: 'Учитывайте расход воды, стоимость обслуживания, полив и жалобы жителей.',
    goNoGo: 'Расширяйте при подтверждённой приживаемости и приемлемых расходах воды и ухода.',
    technologies: [
      { name: 'GIS / PostGIS', purpose: 'реестр растений, площадок и ответственных' },
      { name: 'Датчики влажности', purpose: 'подсказки для полива на пилотных площадках' },
      { name: 'Счётчики воды + журнал работ', purpose: 'связать расход воды с состоянием зелёных зон' },
      { name: 'Мобильная форма осмотра', purpose: 'фиксировать приживаемость и работы бригад' },
    ],
    risks: [
      { title: 'Погода исказит сравнение', mitigation: 'Сравнивать похожие площадки и не считать один сезон долгосрочным доказательством.' },
      { title: 'Датчик ошибается', mitigation: 'Сохранить ручной полив и контрольные измерения.' },
      { title: 'Нет денег на уход', mitigation: 'До закупки закрепить владельца и расходы на несколько сезонов.' },
    ],
  },
  Соцсфера: {
    defaultTitle: 'Сокращение ожидания в районном центре услуг',
    defaultProblem: 'Жители ждут записи на социальную услугу, а время ожидания и нагрузка различаются по площадкам.',
    scopeLabel: 'учреждений или точек обслуживания',
    metricName: 'Медианное время ожидания записи', metricUnit: 'дней', direction: 'lower', baselineExample: 14, targetExample: 8,
    baselineMethod: 'Считать медианное ожидание от запроса до фактического приёма по обезличенным журналам очереди.',
    purpose: 'сократить ожидание и выявить площадки с недостаточной пропускной способностью, не снижая доступность услуги.',
    solution: 'Измерить спрос и загрузку, затем пилотировать запись и маршрутизацию обращений в нескольких учреждениях.',
    beneficiaries: 'жители, сотрудники учреждений и районные координаторы.',
    phaseActions: ['Снять базовую очередь, загрузку и доступность услуги.', 'Согласовать запись, роли, доступность и защиту данных.', 'Пилотировать новую маршрутизацию без остановки текущего обслуживания.', 'Сравнить ожидание, завершённые обращения и доступность по группам.', 'Расширять после проверки качества, нагрузки персонала и поддержки.'],
    pilotMethod: 'Соберите не менее четырёх недель обезличенных данных об очереди и измеряйте тот же показатель во время пилота.',
    comparison: 'Сопоставьте учреждения похожего размера или внедряйте изменение поэтапно с контрольной площадкой.',
    guardrail: 'Проверяйте отказы в услуге, повторные обращения, офлайн-доступ и нагрузку сотрудников.',
    goNoGo: 'Расширяйте только если ожидание сократилось без роста отказов и ухудшения доступа для отдельных групп.',
    technologies: [
      { name: 'Очередь / запись и workflow', purpose: 'маршрутизация обращений и контроль статусов' },
      { name: 'Защищённый API с ролевым доступом', purpose: 'интеграция без лишнего копирования персональных данных' },
      { name: 'Обезличенная аналитика очереди', purpose: 'измерение ожидания и загрузки' },
      { name: 'SMS-уведомления', purpose: 'напоминания о записи при согласии жителя', optional: true },
    ],
    risks: [
      { title: 'Цифровой канал исключит жителей', mitigation: 'Сохранить очный и телефонный каналы; проверить доступность с жителями.' },
      { title: 'Утечка персональных данных', mitigation: 'Минимизировать поля и показывать только агрегированные данные.' },
      { title: 'Нагрузка на персонал вырастет', mitigation: 'Замерить время обработки и включить обучение в план пилота.' },
    ],
  },
  Безопасность: {
    defaultTitle: 'Освещение безопасных переходов у школ',
    defaultProblem: 'На части переходов у школ недостаточная видимость в тёмное время, а данные об освещении и дорожном поведении не объединены.',
    scopeLabel: 'переходов или объектов',
    metricName: 'Доля водителей, соблюдающих ограничение скорости', metricUnit: '%', direction: 'higher', baselineExample: 62, targetExample: 78,
    baselineMethod: 'Считать скорость обезличенными измерителями в одинаковые дни и часы; отдельно учитывать исправность освещения.',
    purpose: 'снизить риск для пешеходов в конкретных точках и быстрее выявлять неисправности.',
    solution: 'Провести аудит видимости и скорости, затем улучшить освещение и разметку на небольшом числе переходов.',
    beneficiaries: 'дети, сопровождающие взрослые, пешеходы и дорожные службы.',
    phaseActions: ['Проверить видимость, свет, скорость и историю инцидентов.', 'Согласовать решения с дорожной службой, школами и владельцами сетей.', 'Установить решения на пилотных переходах и обучить эксплуатацию.', 'Измерить скорость, видимость и исправность до и после.', 'Расширять после проверки безопасности, жалоб и расходов на содержание.'],
    pilotMethod: 'Измеряйте скорость транспорта, видимость и исправность освещения до работ и после на тех же переходах.',
    comparison: 'Сравните с похожими переходами без изменений; редкие ДТП дополняйте более частыми показателями поведения.',
    guardrail: 'Проверяйте безопасность монтажа, ослепление водителей и приватность датчиков.',
    goNoGo: 'Не масштабируйте по числу установленных устройств; нужны измеренный эффект и согласование дорожных специалистов.',
    technologies: [
      { name: 'GIS-реестр переходов', purpose: 'карта объектов, аудитов и ответственных служб' },
      { name: 'Телеметрия освещения', purpose: 'контроль отказов и времени восстановления' },
      { name: 'Радарный счётчик скорости', purpose: 'измерение без распознавания лиц' },
      { name: 'Журнал инцидентов с ролевым доступом', purpose: 'обезличенные события и статусы устранения' },
    ],
    risks: [
      { title: 'Устройства создадут слежение', mitigation: 'Не использовать распознавание лиц; минимизировать сбор и срок хранения данных.' },
      { title: 'Освещение ослепляет водителей', mitigation: 'Проверить проект и провести ночной аудит до расширения.' },
      { title: 'ДТП редки для быстрой оценки', mitigation: 'Измерять скорость, видимость и исправность как опережающие показатели.' },
    ],
  },
  Сервисы: {
    defaultTitle: 'Единый контроль сроков городских обращений',
    defaultProblem: 'Обращения жителей проходят через несколько подразделений, поэтому срок ответа и ответственный этап не всегда видны.',
    scopeLabel: 'типов обращений или подразделений',
    metricName: 'Медианное время закрытия обращения', metricUnit: 'ч', direction: 'lower', baselineExample: 72, targetExample: 24,
    baselineMethod: 'Считать время от регистрации до подтверждённого решения; отделять ожидание жителя от внутренней обработки.',
    purpose: 'сократить срок типовых обращений и сделать ответственность подразделений прозрачной.',
    solution: 'Описать путь обращения, убрать лишние ручные передачи и запустить контроль статуса на одном типе услуги.',
    beneficiaries: 'жители, контакт-центр и подразделения, отвечающие за решение.',
    phaseActions: ['Разобрать путь обращения и сроки по каждому этапу.', 'Утвердить владельца процесса, интеграции и правила хранения данных.', 'Запустить workflow для одного-двух типов обращений с ручным резервом.', 'Сравнить сроки, повторные обращения и возвраты с исходным периодом.', 'Расширять после проверки качества ответов и готовности поддержки.'],
    pilotMethod: 'Зафиксируйте сроки и повторные обращения до запуска; измеряйте те же показатели после пилота.',
    comparison: 'Сравните с похожим типом обращений или подразделением без изменений.',
    guardrail: 'Сокращение срока не должно увеличивать ошибочные закрытия и повторные жалобы.',
    goNoGo: 'Масштабируйте после выборочной проверки качества решений и стабильности интеграций.',
    technologies: [
      { name: 'Workflow / BPM', purpose: 'статусы, сроки и маршрутизация обращений' },
      { name: 'REST API и адаптеры', purpose: 'обмен с действующими системами без двойного ввода' },
      { name: 'Ролевой доступ и аудит', purpose: 'контроль доступа и история действий' },
      { name: 'Обезличенная аналитика SLA', purpose: 'контроль сроков и качества по агрегатам' },
    ],
    risks: [
      { title: 'Автоматизация закрепит плохой процесс', mitigation: 'Сначала упростить процесс вручную, затем автоматизировать пилот.' },
      { title: 'Интеграция нарушит старые системы', mitigation: 'Проверить API, нагрузку и ручной fallback до расширения.' },
      { title: 'Срок сократится, качество упадёт', mitigation: 'Измерять повторные жалобы и вручную проверять выборку ответов.' },
    ],
  },
};

export type ProjectDraft = {
  title: string;
  domain: ProjectDomain;
  budgetKZT: number;
  district: ProjectDistrict;
  scope: number;
  durationMonths: number;
  problem: string;
  baseline: number | null;
  target: number | null;
  dataSource: string;
};

export const demoProjectDraft: ProjectDraft = {
  title: projectProfiles.Транспорт.defaultTitle,
  domain: 'Транспорт',
  budgetKZT: 100_000_000,
  district: 'Есиль',
  scope: 12,
  durationMonths: 12,
  problem: projectProfiles.Транспорт.defaultProblem,
  baseline: projectProfiles.Транспорт.baselineExample,
  target: projectProfiles.Транспорт.targetExample,
  dataSource: 'ДЕМО: замените пример фактическими замерами',
};

export const newProjectDraft: ProjectDraft = {
  title: 'Новый городской проект',
  domain: 'Транспорт',
  budgetKZT: 100_000_000,
  district: 'Весь город',
  scope: 1,
  durationMonths: 12,
  problem: 'Опишите фактическую проблему, место и группу жителей, которых она затрагивает.',
  baseline: null,
  target: null,
  dataSource: '',
};

const stageDefinitions = [
  { title: 'Диагностика и базовая линия', percent: 10, owner: 'Заказчик + аналитик', durationWeight: 0.15 },
  { title: 'Проектирование и подготовка закупки', percent: 15, owner: 'Отраслевой заказчик + ИТ', durationWeight: 0.2 },
  { title: 'Пилотное внедрение', percent: 40, owner: 'Подрядчик + эксплуатация', durationWeight: 0.35 },
  { title: 'Измерение и независимая проверка', percent: 10, owner: 'Аналитик / оценщик', durationWeight: 0.15 },
  { title: 'Условное расширение и передача', percent: 20, owner: 'Владелец сервиса', durationWeight: 0.15 },
  { title: 'Нераспределённый резерв', percent: 5, owner: 'Комитет проекта', durationWeight: 0 },
] as const;

export type ProjectStage = {
  title: string;
  percent: number;
  amountKZT: number;
  owner: string;
  action: string;
  startMonth: number | null;
  endMonth: number | null;
};

export type ProjectGate = {
  status: 'missing-problem' | 'missing-metric' | 'invalid-target' | 'demo-source' | 'review';
  title: string;
  detail: string;
};

export type ProjectPlan = {
  draft: ProjectDraft;
  profile: ProjectProfile;
  stages: ProjectStage[];
  amountPerSiteKZT: number;
  gate: ProjectGate;
  targetImproves: boolean | null;
};

export type ProjectValidation = { valid: boolean; errors: string[] };

export function validateProjectDraft(draft: ProjectDraft): ProjectValidation {
  const errors: string[] = [];
  if (draft.title.trim().length < 3) errors.push('Укажите название проекта — не короче трёх символов.');
  if (!Number.isSafeInteger(draft.budgetKZT) || draft.budgetKZT <= 0) errors.push('Бюджет должен быть положительным целым числом в тенге.');
  if (!projectDomains.includes(draft.domain)) errors.push('Выберите одно из пяти городских направлений.');
  if (!projectDistricts.includes(draft.district)) errors.push('Выберите район или весь город.');
  if (!Number.isSafeInteger(draft.scope) || draft.scope < 1) errors.push('Количество пилотных объектов должно быть целым числом больше нуля.');
  if (!Number.isInteger(draft.durationMonths) || draft.durationMonths < 6 || draft.durationMonths > 36) errors.push('Срок должен быть от 6 до 36 месяцев.');
  if (draft.problem.trim().length < 12) errors.push('Опишите городскую проблему минимум в 12 символах.');
  return { valid: errors.length === 0, errors };
}

function distribute(total: number, shares: readonly number[]): number[] {
  const raw = shares.map((share) => total * share);
  const amounts = raw.map(Math.floor);
  let remaining = total - amounts.reduce((sum, amount) => sum + amount, 0);
  const order = raw.map((amount, index) => ({ index, remainder: amount - amounts[index] })).sort((left, right) => right.remainder - left.remainder);
  for (let index = 0; remaining > 0; index += 1, remaining -= 1) amounts[order[index % order.length].index] += 1;
  return amounts;
}

function allocateMonths(totalMonths: number): number[] {
  const workStages = stageDefinitions.filter((stage) => stage.durationWeight > 0);
  const extras = distribute(totalMonths - workStages.length, workStages.map((stage) => stage.durationWeight));
  return extras.map((months) => months + 1);
}

function targetImprovement(domain: ProjectDomain, baseline: number | null, target: number | null): boolean | null {
  if (baseline === null || target === null || !Number.isFinite(baseline) || !Number.isFinite(target)) return null;
  return projectProfiles[domain].direction === 'lower' ? target < baseline : target > baseline;
}

function gateFor(draft: ProjectDraft, improves: boolean | null): ProjectGate {
  if (/^(опишите|укажите|добавьте)(?:\s|$)/i.test(draft.problem.trim())) return { status: 'missing-problem', title: 'Опишите фактическую проблему', detail: 'Замените текст-подсказку наблюдением, районом и затронутыми жителями; без этого проект нельзя оценить по существу.' };
  if (improves === null) return { status: 'missing-metric', title: 'Зафиксируйте базовую линию и цель', detail: 'До закупки измерьте исходный показатель и согласуйте численную цель пилота с владельцем услуги.' };
  if (!improves) return { status: 'invalid-target', title: 'Цель не улучшает выбранный показатель', detail: 'Проверьте направление изменения: целевое значение должно быть лучше исходного.' };
  if (!draft.dataSource.trim() || /(демо|пример|синтетич)/i.test(draft.dataSource)) return { status: 'demo-source', title: 'Подтвердите источник KPI', detail: 'Сейчас используются демонстрационные или непроверенные данные. Подтвердите их у владельца источника до решения о масштабе.' };
  return { status: 'review', title: 'Паспорт готов к экспертной проверке', detail: 'Приложение не подтверждает источник и не заменяет смету, закупочную, юридическую или техническую экспертизу.' };
}

export function buildProjectPlan(draft: ProjectDraft): ProjectPlan {
  const validation = validateProjectDraft(draft);
  if (!validation.valid) throw new Error(validation.errors[0]);

  const profile = projectProfiles[draft.domain];
  const amounts = distribute(draft.budgetKZT, stageDefinitions.map((stage) => stage.percent / 100));
  const durations = allocateMonths(draft.durationMonths);
  let month = 1;
  const stages = stageDefinitions.map((stage, index) => {
    const action = index < profile.phaseActions.length ? profile.phaseActions[index] : 'Оставить резерв нераспределённым; использовать только по отдельному согласованному решению.';
    if (stage.durationWeight === 0) return { title: stage.title, percent: stage.percent, amountKZT: amounts[index], owner: stage.owner, action, startMonth: null, endMonth: null };
    const duration = durations.shift()!;
    const startMonth = month;
    const endMonth = month + duration - 1;
    month = endMonth + 1;
    return { title: stage.title, percent: stage.percent, amountKZT: amounts[index], owner: stage.owner, action, startMonth, endMonth };
  });
  const improves = targetImprovement(draft.domain, draft.baseline, draft.target);

  return {
    draft: { ...draft, title: draft.title.trim(), problem: draft.problem.trim(), dataSource: draft.dataSource.trim() },
    profile,
    stages,
    amountPerSiteKZT: Math.round(draft.budgetKZT / draft.scope),
    gate: gateFor(draft, improves),
    targetImproves: improves,
  };
}

export function formatKZT(amount: number): string {
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(amount)} ₸`;
}

export function answerProjectQuestion(question: string, plan: ProjectPlan): string {
  const text = question.trim().toLocaleLowerCase('ru-RU');
  const { draft, profile, stages, amountPerSiteKZT, gate } = plan;
  if (!text) return 'Введите вопрос о цели, бюджете, запуске, технологиях, рисках или проверке пилота.';

  if (/(технолог|стек|инструмент|платформ|оборудован|систем)/i.test(text)) {
    return `Для проекта «${draft.title}» предлагается: ${profile.technologies.map((item) => `${item.name} — ${item.purpose}`).join('; ')}. Опциональные решения включайте только после проверки необходимости, безопасности и стоимости владения.`;
  }
  if (/(провер|гипотез|эффект|метрик|измер|доказ)/i.test(text)) {
    return `Проверка: ${profile.pilotMethod} ${profile.comparison} Защитный показатель: ${profile.guardrail} Критерий перехода: ${profile.goNoGo} Текущий статус KPI: ${gate.title}.`;
  }
  if (/(запуск|запуст|этап|план|срок|начать|реализ)/i.test(text)) {
    const schedule = stages.filter((stage) => stage.startMonth !== null).map((stage) => `${stage.title} — месяцы ${stage.startMonth}–${stage.endMonth}`).join('; ');
    return `План на ${draft.durationMonths} месяцев для района «${draft.district}»: ${schedule}. Начните с базовой линии; назначьте владельца эксплуатации и не масштабируйте до прохождения критерия пилота.`;
  }
  if (/(бюджет|смет|стоим|тенге|₸|деньг)/i.test(text)) {
    const split = stages.map((stage) => `${stage.title} — ${formatKZT(stage.amountKZT)} (${stage.percent}%)`).join('; ');
    return `Введённый бюджет ${formatKZT(draft.budgetKZT)} распределён как плановое допущение: ${split}. На один объект приходится ${formatKZT(amountPerSiteKZT)}. Это не рыночная смета: подтвердите суммы коммерческими предложениями и стоимостью эксплуатации.`;
  }
  if (/(риск|угроз|безопас|приват|данн)/i.test(text)) {
    return `Главные риски: ${profile.risks.map((risk) => `${risk.title} — ${risk.mitigation}`).join('; ')}. До закупки назначьте владельца данных, проверьте безопасность и предусмотрите ручной процесс на случай отказа.`;
  }
  if (/(что реш|проблем|зачем|цель|кому|польз)/i.test(text)) {
    return `Проект «${draft.title}» адресует проблему: ${draft.problem} Цель — ${profile.purpose} Решение: ${profile.solution} Основные пользователи: ${profile.beneficiaries}`;
  }

  return `По проекту «${draft.title}» могу пояснить цель, бюджет ${formatKZT(draft.budgetKZT)}, этапы запуска на ${draft.durationMonths} месяцев, технологии, риски и проверку KPI. Уточните один из этих вопросов — отвечу по паспорту, не выдумывая внешние данные.`;
}

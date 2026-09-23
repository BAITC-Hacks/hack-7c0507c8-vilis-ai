'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock3, Download, Info, Lightbulb, MapPin, Plus, Printer, RotateCcw, Save, ShieldCheck, Sparkles, Target, Trash2, Workflow } from 'lucide-react';
import { answerProjectQuestion, buildProjectPlan, demoProjectDraft, formatKZT, newProjectDraft, projectDistricts, projectDomains, projectProfiles, validateProjectDraft, type ProjectDomain, type ProjectDraft, type ProjectPlan } from '@/lib/akim/project-planner';

const storageKey = 'aqmola-project-desk-v1';
const suggestedQuestions = ['Что решает проект?', 'Как запустить?', 'Какие технологии?', 'Как проверить эффект?', 'Как распределён бюджет?'];

type SavedProject = { id: string; updatedAt: string; draft: ProjectDraft };

function isProjectDraft(value: unknown): value is ProjectDraft {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.title === 'string'
    && projectDomains.includes(item.domain as ProjectDomain)
    && typeof item.budgetKZT === 'number'
    && projectDistricts.includes(item.district as ProjectDraft['district'])
    && typeof item.scope === 'number'
    && typeof item.durationMonths === 'number'
    && typeof item.problem === 'string'
    && (item.baseline === null || typeof item.baseline === 'number')
    && (item.target === null || typeof item.target === 'number')
    && typeof item.dataSource === 'string'
    && validateProjectDraft(item as unknown as ProjectDraft).valid;
}

function isSavedProject(value: unknown): value is SavedProject {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && typeof item.updatedAt === 'string' && isProjectDraft(item.draft);
}

function readNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function projectId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function safeSlug(value: string): string {
  return value.trim().toLocaleLowerCase('ru-RU').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'project-passport';
}

function ProjectHeroArt({ budgetKZT }: { budgetKZT: number }) {
  return (
    <div className="project-hero-art" aria-hidden="true">
      <div className="project-hero-glow" />
      <div className="project-hero-orbit project-hero-orbit-one" />
      <div className="project-hero-orbit project-hero-orbit-two" />
      <svg viewBox="0 0 650 450" role="presentation">
        <defs>
          <linearGradient id="project-ground" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4fbf6" /><stop offset="1" stopColor="#dcefe4" /></linearGradient>
          <linearGradient id="project-tower-front" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f9fffb" /><stop offset="1" stopColor="#cce8d7" /></linearGradient>
          <linearGradient id="project-tower-side" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b6dec7" /><stop offset="1" stopColor="#8bc9a7" /></linearGradient>
          <linearGradient id="project-tower-roof" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffffff" /><stop offset="1" stopColor="#d6ecdf" /></linearGradient>
          <filter id="project-city-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="11" floodColor="#386a4f" floodOpacity=".13" /></filter>
        </defs>
        <path d="M323 24 615 194 323 362 32 192Z" fill="url(#project-ground)" stroke="#d3e8da" strokeWidth="1.5" />
        <g fill="none" stroke="#c5dfcf" strokeWidth="1" opacity=".7">
          <path d="m73 217 291-168M116 242 407 74M159 267 450 99M202 292 493 124M245 317 536 149M289 343 579 175" />
          <path d="m83 162 291 170M132 134l291 170M181 106l291 170M229 78l291 170M278 50l291 170" />
        </g>
        <path d="m72 203 250 145 254-147" fill="none" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" opacity=".84" />
        <path d="m72 203 250 145 254-147" fill="none" stroke="#9ccbad" strokeWidth="1.5" strokeDasharray="3 12" strokeLinecap="round" />
        <g filter="url(#project-city-shadow)">
          <path d="m114 166 57-33 59 34-58 34z" fill="url(#project-tower-roof)" />
          <path d="m114 166 58 35v87l-58-34z" fill="url(#project-tower-front)" />
          <path d="m172 201 58-34v87l-58 34z" fill="url(#project-tower-side)" />
          <path d="m127 171 12-7v53l-12-7zm26 15 12-7v53l-12-7z" fill="#00b86f" opacity=".44" />
          <path d="m184 205 12-7v48l-12 7zm24-14 12-7v49l-12 7z" fill="#ffffff" opacity=".74" />
          <path d="m260 115 61-36 62 36-62 37z" fill="url(#project-tower-roof)" />
          <path d="m260 115 61 37v164l-61-36z" fill="url(#project-tower-front)" />
          <path d="m321 152 62-37v165l-62 36z" fill="url(#project-tower-side)" />
          <path d="m276 128 11 7v111l-11-7zm27 16 11 7v111l-11-7z" fill="#00b86f" opacity=".56" />
          <path d="m337 162 11-7v109l-11 7zm27-16 11-7v109l-11 7z" fill="#ffffff" opacity=".7" />
          <path d="m316 77 5-36 5 36" fill="#00b86f" />
          <circle cx="321" cy="34" r="5" fill="#7966ed" />
          <path d="m401 181 47-28 48 28-48 29z" fill="url(#project-tower-roof)" />
          <path d="m401 181 47 29v75l-47-28z" fill="url(#project-tower-front)" />
          <path d="m448 210 48-29v76l-48 28z" fill="url(#project-tower-side)" />
          <path d="m414 188 10-6v45l-10-6zm22 14 10-6v45l-10-6z" fill="#00b86f" opacity=".46" />
          <path d="m460 217 10-6v42l-10 6zm20-12 10-6v42l-10 6z" fill="#ffffff" opacity=".7" />
        </g>
        <g fill="#42bd7f" opacity=".9"><circle cx="89" cy="232" r="8" /><circle cx="105" cy="241" r="7" /><circle cx="548" cy="194" r="9" /><circle cx="563" cy="185" r="7" /></g>
        <g fill="#7c68ed"><circle cx="260" cy="238" r="7" /><circle cx="384" cy="248" r="6" /></g>
        <g fill="none" stroke="#00b86f" strokeWidth="2">
          <path d="m171 200 90 38 123 10 64-39" strokeDasharray="4 7" />
          <circle cx="171" cy="200" r="5" fill="#fff" /><circle cx="384" cy="248" r="5" fill="#fff" /><circle cx="448" cy="209" r="5" fill="#fff" />
        </g>
      </svg>
      <div className="project-hero-float project-hero-budget">
        <span><i /> ВХОДНОЙ БЮДЖЕТ</span>
        <strong>{formatKZT(budgetKZT)}</strong>
        <small>Сумма текущего проекта</small>
      </div>
      <div className="project-hero-float project-hero-check">
        <span className="project-check-mark"><CheckCircle2 size={16} /></span>
        <div><small>СНАЧАЛА ДОКАЗАТЬ</small><strong>Пилот → KPI → масштаб</strong></div>
      </div>
      <span className="project-hero-label">CITY PROJECT · ASTANA</span>
    </div>
  );
}

export default function ProjectDesk() {
  const [draft, setDraft] = useState<ProjectDraft>({ ...demoProjectDraft });
  const [plan, setPlan] = useState<ProjectPlan>(() => buildProjectPlan(demoProjectDraft));
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const draftValidation = useMemo(() => validateProjectDraft(draft), [draft]);
  const planIsCurrent = !dirty;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const projects = parsed.filter(isSavedProject);
          setSavedProjects(projects);
          if (projects[0]) {
            setDraft(projects[0].draft);
            setPlan(buildProjectPlan(projects[0].draft));
            setActiveProjectId(projects[0].id);
          }
        }
      }
    } catch {
      setNotice('Не удалось прочитать локальные проекты. Создайте новый паспорт и сохраните его ещё раз.');
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedProjects));
    } catch {
      setNotice('Хранилище браузера заполнено. Экспортируйте проекты в JSON и освободите место.');
    }
  }, [savedProjects, storageReady]);

  function updateDraft<Key extends keyof ProjectDraft>(key: Key, value: ProjectDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setErrors([]);
    setAnswer('');
  }

  function changeDomain(domain: ProjectDomain) {
    const next = projectProfiles[domain];
    setDraft((current) => ({
      ...current,
      domain,
      title: current.title === projectProfiles[current.domain].defaultTitle ? next.defaultTitle : current.title,
      problem: current.problem === projectProfiles[current.domain].defaultProblem ? next.defaultProblem : current.problem,
      baseline: next.baselineExample,
      target: next.targetExample,
      dataSource: 'ДЕМО: замените пример фактическими замерами',
    }));
    setDirty(true);
    setErrors([]);
    setAnswer('');
  }

  function generatePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateProjectDraft(draft);
    setErrors(validation.errors);
    if (!validation.valid) return;
    const nextPlan = buildProjectPlan(draft);
    setPlan(nextPlan);
    setDraft(nextPlan.draft);
    setDirty(false);
    setAnswer('');
    setNotice('Паспорт пересчитан. Числа бюджета распределены точно; эффект не считается подтверждённым прогнозом.');
  }

  function saveProject() {
    const validation = validateProjectDraft(draft);
    if (!validation.valid) {
      setErrors(validation.errors);
      setNotice('Исправьте обязательные поля, чтобы сохранить паспорт.');
      return;
    }
    const id = activeProjectId ?? projectId();
    const record = { id, updatedAt: new Date().toISOString(), draft: { ...draft } };
    const nextPlan = buildProjectPlan(record.draft);
    setPlan(nextPlan);
    setDraft(nextPlan.draft);
    setDirty(false);
    setAnswer('');
    setSavedProjects((current) => [record, ...current.filter((item) => item.id !== id)]);
    setActiveProjectId(id);
    setNotice('Проект сохранён в этом браузере. Данные не отправляются на сервер.');
  }

  function openProject(project: SavedProject) {
    const nextDraft = { ...project.draft };
    setDraft(nextDraft);
    setPlan(buildProjectPlan(nextDraft));
    setActiveProjectId(project.id);
    setDirty(false);
    setErrors([]);
    setAnswer('');
    setNotice(`Открыт паспорт «${project.draft.title}».`);
  }

  function newProject() {
    const nextDraft = { ...newProjectDraft };
    setDraft(nextDraft);
    setPlan(buildProjectPlan(nextDraft));
    setActiveProjectId(null);
    setDirty(false);
    setErrors([]);
    setQuestion('');
    setAnswer('');
    setNotice('Создан черновик. Замените текст-подсказку и демо-бюджет фактическими данными своего проекта.');
  }

  function loadDemoProject() {
    const nextDraft = { ...demoProjectDraft };
    setDraft(nextDraft);
    setPlan(buildProjectPlan(nextDraft));
    setActiveProjectId(null);
    setDirty(false);
    setErrors([]);
    setQuestion('');
    setAnswer('');
    setNotice('Загружен демонстрационный проект на 100 млн ₸. Замените примеры данными своего проекта.');
  }

  function removeProject(id: string) {
    const project = savedProjects.find((item) => item.id === id);
    if (project && !window.confirm(`Удалить локальный паспорт «${project.draft.title}»?`)) return;
    setSavedProjects((current) => current.filter((item) => item.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
    setNotice('Сохранённый паспорт удалён из этого браузера.');
  }

  function exportPlan() {
    if (dirty) {
      setNotice('Сначала сформируйте паспорт по изменённым данным — тогда JSON будет соответствовать черновику.');
      return;
    }
    const payload = { exportedAt: new Date().toISOString(), note: 'Плановое допущение, а не официальная смета или подтверждённый прогноз.', plan };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeSlug(plan.draft.title)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('JSON-паспорт скачан.');
  }

  function askProject(questionText = question) {
    setQuestion(questionText);
    if (dirty) {
      setAnswer('Сначала сформируйте паспорт по изменённым данным — затем ответы будут учитывать новый сценарий.');
      return;
    }
    setAnswer(answerProjectQuestion(questionText, plan));
  }

  const gateClass = plan.gate.status === 'review' ? 'is-review' : plan.gate.status === 'invalid-target' ? 'is-invalid' : 'is-hold';

  return (
    <main className="project-app" id="top">
      <header className="project-site-header">
        <a className="project-brand" href="#top" aria-label="AqmolaCouncil — городской проектный офис">
          <span className="project-brand-mark"><svg viewBox="0 0 44 36" aria-hidden="true"><path d="M5 29V14h7v15H5Zm11 0V7h7v22h-7Zm11 0V17h7v12h-7Zm11 0V3h5v26h-5Z" fill="currentColor" /><path d="M3 33h39" stroke="#7864ed" strokeWidth="2.5" strokeLinecap="round" /></svg></span>
          <span><b>AQMOLA</b><small>CITY PROJECT OFFICE</small></span>
        </a>
        <nav className="project-site-nav" aria-label="Разделы продукта">
          <a className="is-current" href="#passport">Проектный офис</a>
          <a href="/simulator">Симулятор бюджета</a>
          <a href="#method">Методика</a>
        </nav>
        <div className="project-site-actions">
          <div className="project-local-badge"><span /> ЛОКАЛЬНЫЙ РЕЖИМ</div>
          <a className="project-header-cta" href="#passport">Создать паспорт <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <section className="project-hero" aria-labelledby="project-hero-title">
        <div className="project-hero-copy">
          <span className="project-overline"><i /> DIGITAL CITY OFFICE <b>·</b> ASTANA</span>
          <h1 id="project-hero-title">Городские проекты.<br /><em>С понятным результатом.</em></h1>
          <p>Введите бюджет и задачу — получите план пилота, подходящие технологии, проверку KPI и условия для решения о масштабировании.</p>
          <div className="project-hero-actions">
            <a className="project-hero-primary" href="#passport">Собрать паспорт <ArrowRight size={17} /></a>
            <a className="project-hero-secondary" href="/simulator">Открыть бюджет города <ArrowUpRight size={15} /></a>
          </div>
          <div className="project-hero-metrics">
            <div><strong>5</strong><span>городских<br />направлений</span></div>
            <div><strong>{formatKZT(draft.budgetKZT)}</strong><span>бюджет текущего<br />сценария</span></div>
            <div><strong>6</strong><span>этапов до<br />проверки эффекта</span></div>
          </div>
        </div>
        <ProjectHeroArt budgetKZT={draft.budgetKZT} />
        <div className="project-hero-index">
          <a href="#passport"><span>01</span><div><small>ПАСПОРТ ПРОЕКТА</small><strong>Проблема → план → KPI</strong></div><ArrowRight size={17} /></a>
          <a href="/simulator"><span>02</span><div><small>БЮДЖЕТ ГОРОДА</small><strong>Пять решений → индекс</strong></div><ArrowRight size={17} /></a>
          <a href="#validation"><span>03</span><div><small>ПРОВЕРКА ГИПОТЕЗЫ</small><strong>Доказать до масштаба</strong></div><ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="project-saved-section" aria-label="Мои проекты">
        <div className="project-saved-heading">
          <div><span>РАБОЧИЕ СЦЕНАРИИ</span><h2>Мои проекты <small>{savedProjects.length.toString().padStart(2, '0')}</small></h2></div>
          <button type="button" onClick={newProject}><Plus size={16} /> Новый проект</button>
        </div>
        <div className="project-saved-list">
          {savedProjects.length ? savedProjects.slice(0, 8).map((project) => (
            <div className={`project-saved-item ${activeProjectId === project.id ? 'is-selected' : ''}`} key={project.id}>
              <button type="button" className="project-saved-open" onClick={() => openProject(project)}><span>{project.draft.title}</span><small>{formatKZT(project.draft.budgetKZT)} · {project.draft.domain}</small></button>
              <button type="button" className="project-saved-delete" aria-label={`Удалить ${project.draft.title}`} onClick={() => removeProject(project.id)}><Trash2 size={13} /></button>
            </div>
          )) : <p className="project-saved-empty">Сохраните паспорт — он останется в этом браузере.</p>}
        </div>
      </section>

      <section className="project-main" id="passport">
        <div className="project-content">
          <header className="project-topbar">
            <div className="project-breadcrumb"><span>АКИМ / ПРОЕКТНЫЙ ОФИС</span><ArrowRight size={14} /><b>{activeProjectId ? 'СОХРАНЁННЫЙ ПРОЕКТ' : 'НОВЫЙ ПАСПОРТ'}</b></div>
            <div className="project-top-actions">
              <span className="project-mode"><span /> ЛОКАЛЬНЫЙ ДВИЖОК</span>
              <button type="button" onClick={saveProject}><Save size={15} /> Сохранить</button>
              <button type="button" disabled={!planIsCurrent} title={dirty ? 'Сначала сформируйте паспорт по изменённым данным' : 'Печать или сохранение в PDF'} onClick={() => window.print()}><Printer size={15} /> PDF</button>
              <button type="button" disabled={!planIsCurrent} title={dirty ? 'Сначала сформируйте паспорт по изменённым данным' : 'Скачать структурированный JSON'} onClick={exportPlan}><Download size={15} /> JSON</button>
            </div>
          </header>

          <header className="project-page-heading">
            <div><span className="project-overline"><i /> РЕШЕНИЕ ДО ЗАКУПКИ <b>·</b> 01 / 02</span><h2>Рабочая область проекта</h2><p>Зафиксируйте проблему и способ измерения — затем соберите план пилота и проверьте его условия.</p></div>
            <button type="button" className="project-reset" onClick={loadDemoProject}><RotateCcw size={15} /> Демо-проект</button>
          </header>
          {notice && <div className="project-notice" role="status"><Info size={15} /> <span>{notice}</span><button type="button" aria-label="Скрыть сообщение" onClick={() => setNotice('')}>×</button></div>}

          <div className="project-layout">
            <form className="project-form-card" onSubmit={generatePlan}>
              <div className="project-card-heading"><div><span>01 / ИСХОДНЫЕ ДАННЫЕ</span><h2>Опишите проект</h2></div><span className="project-step-indicator">{draftValidation.errors.length ? 'ПРОВЕРЬТЕ ПОЛЯ' : 'ЧЕРНОВИК'}</span></div>

              <label className="project-field"><span>Название проекта</span><input value={draft.title} maxLength={100} onChange={(event) => updateDraft('title', event.target.value)} placeholder="Например, умный переход у школы" /></label>
              <div className="project-form-row">
                <label className="project-field"><span>Направление</span><select value={draft.domain} onChange={(event) => changeDomain(event.target.value as ProjectDomain)}>{projectDomains.map((domain) => <option key={domain} value={domain}>{domain === 'Экология' ? 'Озеленение и экология' : domain}</option>)}</select></label>
                <label className="project-field"><span>Район</span><select value={draft.district} onChange={(event) => updateDraft('district', event.target.value as ProjectDraft['district'])}>{projectDistricts.map((district) => <option key={district}>{district}</option>)}</select></label>
              </div>
              <label className="project-field"><span>Бюджет проекта</span><div className="project-money-input"><input type="number" min="1" step="1" value={draft.budgetKZT || ''} onChange={(event) => updateDraft('budgetKZT', Number(event.target.value))} placeholder="100000000" /><b>₸</b></div><small>Введите сумму в тенге; распределение по этапам — плановая гипотеза, не рыночная смета.</small></label>
              <div className="project-form-row">
                <label className="project-field"><span>Объём пилота</span><div className="project-inline-input"><input type="number" min="1" step="1" value={draft.scope || ''} onChange={(event) => updateDraft('scope', Number(event.target.value))} /><small>{projectProfiles[draft.domain].scopeLabel}</small></div></label>
                <label className="project-field"><span>Горизонт плана</span><div className="project-inline-input"><input type="number" min="6" max="36" step="1" value={draft.durationMonths || ''} onChange={(event) => updateDraft('durationMonths', Number(event.target.value))} /><small>месяцев</small></div></label>
              </div>
              <label className="project-field"><span>Какую проблему решаем?</span><textarea value={draft.problem} maxLength={600} rows={4} onChange={(event) => updateDraft('problem', event.target.value)} placeholder="Опишите, что не работает сейчас, где и для кого." /><small>{draft.problem.length}/600 · укажите наблюдаемую проблему, а не готовую закупку.</small></label>

              <section className="project-kpi-inputs">
                <div className="project-kpi-heading"><span><Target size={15} /> ИЗМЕРИМЫЙ РЕЗУЛЬТАТ</span><small>Не прогноз, а цель для проверки</small></div>
                <p>{projectProfiles[draft.domain].metricName}</p>
                <div className="project-form-row">
                  <label className="project-field"><span>Базовое значение</span><div className="project-inline-input"><input type="number" step="any" value={draft.baseline ?? ''} onChange={(event) => updateDraft('baseline', readNumber(event.target.value))} placeholder="Не измерено" /><small>{projectProfiles[draft.domain].metricUnit}</small></div></label>
                  <label className="project-field"><span>Цель пилота</span><div className="project-inline-input"><input type="number" step="any" value={draft.target ?? ''} onChange={(event) => updateDraft('target', readNumber(event.target.value))} placeholder="Задайте KPI" /><small>{projectProfiles[draft.domain].metricUnit}</small></div></label>
                </div>
                <small className="project-kpi-method">{projectProfiles[draft.domain].baselineMethod}</small>
                <label className="project-field project-source-field"><span>Источник базового значения</span><input value={draft.dataSource} maxLength={160} onChange={(event) => updateDraft('dataSource', event.target.value)} placeholder="Например: замеры дорожной службы, период и дата" /></label>
              </section>

              {errors.length > 0 && <div className="project-errors" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
              <button className="project-generate-button" type="submit"><Sparkles size={17} /> Сформировать паспорт <ArrowRight size={16} /></button>
              <p className="project-form-footnote"><ShieldCheck size={14} /> Математика бюджета детерминирована. Данные и гипотезы вводит пользователь.</p>
            </form>

            <article className="project-report-card" aria-live="polite">
              <header className="project-report-header">
                <div><span className="project-report-kicker"><i /> СФОРМИРОВАННЫЙ ПАСПОРТ <b>·</b> {planIsCurrent ? 'АКТУАЛЕН' : 'ЧЕРНОВИК ИЗМЕНЁН'}</span><h2>{plan.draft.title}</h2><p><MapPin size={14} /> {plan.draft.district} <span>·</span> {plan.draft.domain} <span>·</span> {plan.draft.scope} {plan.profile.scopeLabel}</p></div>
                <span className={`project-gate-badge ${gateClass}`}><span /> {plan.gate.title}</span>
              </header>
              <div className="project-report-stats">
                <div><small>БЮДЖЕТ ВВОДА</small><strong>{formatKZT(plan.draft.budgetKZT)}</strong><span>плановое допущение</span></div>
                <div><small>НА ОДИН ОБЪЕКТ</small><strong>{formatKZT(plan.amountPerSiteKZT)}</strong><span>бюджет ÷ объём пилота</span></div>
                <div><small>ГОРИЗОНТ ПЛАНА</small><strong>{plan.draft.durationMonths} <i>мес.</i></strong><span>до решения о масштабе</span></div>
              </div>

              <section className="project-report-section project-purpose-section">
                <div className="project-section-title"><span className="project-section-icon"><Lightbulb size={17} /></span><div><small>01 / ПРОБЛЕМА И ЦЕННОСТЬ</small><h3>Что меняем и для кого</h3></div></div>
                <div className="project-purpose-grid"><div><small>СЕЙЧАС</small><p>{plan.draft.problem}</p></div><div><small>ЗАДАЧА ПРОЕКТА</small><p>{plan.profile.purpose}</p></div><div><small>КАК РЕШАЕМ</small><p>{plan.profile.solution}</p></div></div>
                <div className="project-beneficiaries"><span>ПОЛЬЗОВАТЕЛИ</span><b>{plan.profile.beneficiaries}</b></div>
              </section>

              <section className="project-report-section">
                <div className="project-section-title"><span className="project-section-icon"><Clock3 size={17} /></span><div><small>02 / РЕАЛИЗАЦИЯ</small><h3>План запуска и бюджет</h3></div><span className="project-section-note">ТЕНГЕ · ПО ЭТАПАМ</span></div>
                <div className="project-allocation-list">{plan.stages.map((stage, index) => (
                  <div className="project-allocation" key={stage.title}>
                    <div className="project-allocation-number">0{index + 1}</div>
                    <div className="project-allocation-content"><div className="project-allocation-title"><b>{stage.title}</b><span>{stage.startMonth === null ? 'Резерв' : `${stage.startMonth}–${stage.endMonth} мес.`}</span></div><div className="project-allocation-track"><span style={{ width: `${stage.percent}%` }} /></div><p>{stage.action}</p><small>ОТВЕТСТВЕННЫЙ · {stage.owner}</small></div>
                    <div className="project-allocation-amount"><strong>{formatKZT(stage.amountKZT)}</strong><small>{stage.percent}% бюджета</small></div>
                  </div>
                ))}</div>
                <div className="project-total-row"><span><CheckCircle2 size={15} /> Распределено без потери округления</span><b>{formatKZT(plan.stages.reduce((sum, stage) => sum + stage.amountKZT, 0))}</b></div>
              </section>

              <section className="project-report-section">
                <div className="project-section-title"><span className="project-section-icon"><Workflow size={17} /></span><div><small>03 / ТЕХНОЛОГИИ</small><h3>Минимальный стек пилота</h3></div><span className="project-section-note">ПОДБОР ПО НАПРАВЛЕНИЮ</span></div>
                <div className="project-technology-list">{plan.profile.technologies.map((technology) => <div className="project-technology" key={technology.name}><span className="project-tech-dot" /><div><b>{technology.name}</b><p>{technology.purpose}</p></div>{technology.optional && <small>ПО НЕОБХОДИМОСТИ</small>}</div>)}</div>
                <div className="project-tech-note"><Info size={14} /> Закупочную спецификацию, совместимость с городскими системами, ИБ и стоимость владения подтвердить до выбора поставщика.</div>
              </section>

              <section className="project-report-section project-validation-section" id="validation">
                <div className="project-section-title"><span className="project-section-icon"><Target size={17} /></span><div><small>04 / ПРОВЕРКА ГИПОТЕЗЫ</small><h3>Доказать до масштабирования</h3></div><span className={`project-kpi-status ${plan.targetImproves ? 'is-positive' : 'is-warning'}`}>{plan.targetImproves ? 'ЦЕЛЬ ЗАДАНА' : 'НУЖНЫ ДАННЫЕ'}</span></div>
                <div className="project-hypothesis"><div><small>ГИПОТЕЗА ПРОЕКТА</small><p>Если решение работает, показатель «{plan.profile.metricName}» должен измениться с <b>{plan.draft.baseline ?? 'не измерено'} {plan.profile.metricUnit}</b> до <b>{plan.draft.target ?? 'цель не задана'} {plan.profile.metricUnit}</b>.</p></div><span><ArrowRight size={17} /></span></div>
                <div className="project-validation-steps"><div><b>01</b><p>{plan.profile.pilotMethod}</p></div><div><b>02</b><p>{plan.profile.comparison}</p></div><div><b>03</b><p>{plan.profile.guardrail}</p></div></div>
                <div className={`project-decision-gate ${gateClass}`}><div><ShieldCheck size={18} /><b>Ворота решения</b></div><p>{plan.profile.goNoGo} {plan.gate.detail}</p></div>
              </section>

              <section className="project-report-section">
                <div className="project-section-title"><span className="project-section-icon"><ShieldCheck size={17} /></span><div><small>05 / РИСКИ И ЗАЩИТА</small><h3>Что проверить заранее</h3></div></div>
                <div className="project-risk-list">{plan.profile.risks.map((risk) => <div className="project-risk" key={risk.title}><span>!</span><div><b>{risk.title}</b><p>{risk.mitigation}</p></div></div>)}</div>
              </section>

              <section className="project-qa-section">
                <div className="project-section-title"><span className="project-section-icon"><Sparkles size={17} /></span><div><small>06 / СПРОСИТЬ ПО ПРОЕКТУ</small><h3>Совет по паспорту</h3></div><span className="project-section-note">ЛОКАЛЬНЫЕ ПРАВИЛА · БЕЗ ВНЕШНЕГО ИИ</span></div>
                <form className="project-qa-form" onSubmit={(event) => { event.preventDefault(); askProject(); }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Например: как проверить эффект до масштабирования?" aria-label="Вопрос о проекте" /><button type="submit" aria-label="Задать вопрос"><ArrowUpRight size={17} /></button></form>
                <div className="project-question-chips">{suggestedQuestions.map((item) => <button type="button" key={item} onClick={() => askProject(item)}>{item}</button>)}</div>
                {answer && <div className="project-answer"><span><Sparkles size={14} /> ОТВЕТ ПО ТЕКУЩЕМУ ПАСПОРТУ</span><p>{answer}</p></div>}
              </section>

              <footer className="project-report-footnote" id="method"><Info size={15} /><p>Разбивка по этапам — стартовый шаблон, не подтверждённая смета. KPI и демо-значения не являются официальными данными или прогнозом. Для инвестиционного решения нужны исходные измерения, коммерческие предложения, профильная экспертиза и утверждение владельца проекта.</p></footer>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

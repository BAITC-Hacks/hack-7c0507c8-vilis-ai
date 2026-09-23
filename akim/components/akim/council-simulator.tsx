'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Info, Menu, RotateCcw, Sparkles, Wallet, X } from 'lucide-react';
import { BUDGET, calculate, districts, domainColors, indicators, initialDecisions, initiatives, type Decision, type DistrictId, type Domain, validateDecisions } from '@/lib/akim/qol';

const domains = [...new Set(initiatives.map((initiative) => initiative.domain))] as Domain[];
const format = (value: number) => value.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const money = (value: number) => `${value} у.е.`;

export default function CouncilSimulator() {
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroTab, setHeroTab] = useState(0);
  const validation = useMemo(() => validateDecisions(decisions), [decisions]);
  const result = useMemo(() => validation.valid ? calculate(decisions) : null, [decisions, validation.valid]);
  const percent = Math.min(100, validation.cost / BUDGET * 100);
  const weakest = result && districts.find((district) => district.id === result.weakestDistrict)!;
  const weakestIndicator = result && districts.flatMap((district) => indicators.map((indicator) => ({ district, indicator, value: result.after[district.id][indicator.id] }))).sort((left, right) => left.value - right.value)[0];
  const heroStats = [{ title: 'ВИРТУАЛЬНЫЙ БЮДЖЕТ', value: '100', unit: 'у.е.', note: 'одинаковый для каждой команды' }, { title: 'РАЙОНА ГОРОДА', value: '05', unit: 'районов', note: 'синтетический городской профиль' }, { title: 'МЕР В КАТАЛОГЕ', value: '14', unit: 'проектов', note: 'пять направлений развития' }];
  const activeHeroStat = heroStats[heroTab];

  function toggle(initiativeId: string) {
    setDecisions((current) => {
      const exists = current.find((decision) => decision.initiativeId === initiativeId);
      if (exists) return current.filter((decision) => decision.initiativeId !== initiativeId);
      if (current.length >= 5) return current;
      const initiative = initiatives.find((item) => item.id === initiativeId)!;
      return [...current, { initiativeId, ...(initiative.scope === 'district' ? { districtId: 'nura' as DistrictId } : {}) }];
    });
  }

  function setDistrict(initiativeId: string, districtId: DistrictId) {
    setDecisions((current) => current.map((decision) => decision.initiativeId === initiativeId ? { ...decision, districtId } : decision));
  }

  return (
    <main className="council-shell">
      <header className="ain-nav-shell">
        <a className="ain-brand" href="/" aria-label="AqmolaCouncil — проектный офис">
          <svg viewBox="0 0 64 32" aria-hidden="true"><path d="M5 27V14h8v13H5Zm12 0V8h8v19h-8Zm12 0V17h8v10h-8Zm12 0V4h8v23h-8Zm12 0V12h7v15h-7Z" fill="#00e58a"/><path d="M4 29h57" stroke="#6d63ff" strokeWidth="2"/></svg>
          <span>AQMOLA<br /><b>COUNCIL</b><small>CITY MANAGEMENT LAB</small></span>
        </a>
        <nav className={`ain-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Навигация">
          <a href="/">Проектный офис</a>
          <a href="#simulator" onClick={() => setMenuOpen(false)}>Симулятор</a>
          <a href="#directions" onClick={() => setMenuOpen(false)}>Направления</a>
          <a href="#council" onClick={() => setMenuOpen(false)}>Совет города</a>
        </nav>
        <div className="ain-nav-actions">
          <button className="ain-language" aria-label="Язык: русский"><span>◎</span> RU <ChevronDown size={12} /></button>
          <a className="ain-lab-button" href="#council"><Sparkles size={14} /> Совет города</a>
          <a className="ain-city-button" href="#top">АСТАНА</a>
          <button className="ain-menu-button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
        </div>
      </header>

      <section className="ain-hero" id="top">
        <div className="ain-hero-copy">
          <span className="ain-overline"><i /> DIGITAL CITY LAB <b>/</b> АСТАНА</span>
          <h1>Создаём<br /><em>умный город</em></h1>
          <p>Пять решений меняют целый город. Распределите бюджет между транспортом, зелёными зонами, социальной сферой, безопасностью и сервисами — и посмотрите, что произойдёт.</p>
          <div className="ain-hero-actions"><a href="#simulator" className="ain-start-button">Запустить симуляцию <ArrowUpRight size={17} /></a><a href="#how-it-works" className="ain-text-link">Как это работает <ArrowRight size={15} /></a></div>
          <div className="ain-hero-caption"><span className="ain-caption-pulse" /> МОДЕЛЬ УПРАВЛЕНИЯ ГОРОДОМ <b>·</b> ГОРИЗОНТ 8 КВАРТАЛОВ</div>
        </div>
        <div className="ain-hero-art" aria-label="Иллюстрация аналитического помощника для управления городом">
          <div className="ain-art-glow" />
          <div className="ain-art-backplate"><span /> <span /> <span /></div>
          <svg className="ain-robot" viewBox="0 0 460 500" role="img" aria-label="Оригинальная иллюстрация городского помощника">
            <defs>
              <linearGradient id="ain-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#34383b"/><stop offset=".48" stopColor="#111416"/><stop offset="1" stopColor="#565b5c"/></linearGradient>
              <linearGradient id="ain-edge" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#596063"/><stop offset="1" stopColor="#181c1e"/></linearGradient>
              <filter id="ain-shadow" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity=".75"/></filter>
            </defs>
            <ellipse cx="230" cy="455" rx="124" ry="21" fill="#00e58a" opacity=".16" />
            <g filter="url(#ain-shadow)">
              <path d="M173 302 116 322q-20 8-23 31l-13 76q-2 14 11 17l21 4q15 2 19-14l18-58 31-13z" fill="url(#ain-metal)" stroke="#616668" strokeWidth="2"/>
              <path d="m287 302 57 20q20 8 23 31l13 76q2 14-11 17l-21 4q-15 2-19-14l-18-58-31-13z" fill="url(#ain-metal)" stroke="#616668" strokeWidth="2"/>
              <path d="M166 270q-27 12-39 42l-16 71 58 20 25-73 9 114h54l9-114 25 73 58-20-16-71q-12-30-39-42l-32-12h-64z" fill="url(#ain-metal)" stroke="#686e70" strokeWidth="2"/>
              <path d="M187 275q43 29 86 0l23 19-23 34h-86l-23-34z" fill="#171b1d" stroke="#515759" strokeWidth="2"/>
              <path d="M202 317h56l20 63-48 43-48-43z" fill="#0c1110" stroke="#565e5b" strokeWidth="2"/>
              <path d="m230 337 18 20-18 18-18-18z" fill="#00e58a"/><path d="m230 343 10 14-10 10-10-10z" fill="#101615"/>
              <rect x="213" y="209" width="34" height="54" rx="12" fill="url(#ain-edge)" stroke="#646b6d" strokeWidth="2"/>
              <path d="M169 132q0-34 34-43 27-7 54 0 34 9 34 43v69q0 45-31 62-30 17-60 0-31-17-31-62z" fill="url(#ain-edge)" stroke="#8a8e8e" strokeWidth="3"/>
              <path d="M181 151q0-23 25-30 24-7 48 0 25 7 25 30v40q0 32-24 43-25 12-50 0-24-11-24-43z" fill="#060909" stroke="#282d2e" strokeWidth="2"/>
              <path d="m193 170 22-5m30 0 22 5" stroke="#00e58a" strokeWidth="5" strokeLinecap="round"/><circle cx="204" cy="170" r="3" fill="#dcfff0"/><circle cx="256" cy="170" r="3" fill="#dcfff0"/>
              <path d="M218 201h24" stroke="#707779" strokeWidth="2" strokeLinecap="round"/>
              <path d="M169 154q-22-12-26 14v27q2 19 25 12m123-53q22-12 26 14v27q-2 19-25 12" fill="url(#ain-metal)" stroke="#727779" strokeWidth="2"/>
              <path d="M229 90V69m0 0q0-10 11-10" stroke="#737a79" strokeWidth="4" strokeLinecap="round"/><circle cx="242" cy="58" r="6" fill="#00e58a"/>
              <path d="M179 386h102" stroke="#00e58a" strokeWidth="2" opacity=".8"/><text x="230" y="405" textAnchor="middle" fill="#e2eee8" fontSize="10" fontFamily="Arial" letterSpacing="2">AKIM / AI</text>
            </g>
          </svg>
          <div className="ain-hero-stat"><small>{activeHeroStat.title}</small><strong>{activeHeroStat.value}<i>{activeHeroStat.unit}</i></strong><span>{activeHeroStat.note}</span></div>
          <div className="ain-art-status"><i /> НАПРАВЛЕНИЯ МОДЕЛИ <b>05</b></div>
        </div>
        <div className="ain-hero-tabs" role="tablist" aria-label="Факты о симуляторе">
          {heroStats.map((stat, index) => <button key={stat.title} role="tab" aria-selected={heroTab === index} onClick={() => setHeroTab(index)}><span>0{index + 1}</span><b>{stat.value} {stat.unit}</b><small>{stat.title}</small></button>)}
        </div>
        <a href="#simulator" className="ain-scroll-hint"><span /> SCROLL TO EXPLORE</a>
      </section>
      <section className="council-workspace" id="simulator">
        <div className="council-section-head">
          <div><span className="council-kicker">01 / СОБЕРИТЕ СЦЕНАРИЙ</span><h2>Выберите ровно пять мер</h2></div>
          <button className="council-reset" onClick={() => setDecisions(initialDecisions)}><RotateCcw size={15} /> Вернуть пример</button>
        </div>
        <div className="council-builder-grid">
          {domains.map((domain) => {
            const items = initiatives.filter((initiative) => initiative.domain === domain);
            const count = decisions.filter((decision) => items.some((initiative) => initiative.id === decision.initiativeId)).length;
            return <section className="council-domain" key={domain} style={{ '--domain-color': domainColors[domain] } as React.CSSProperties}>
              <header><span className="council-domain-icon">{domain.slice(0, 1)}</span><strong>{domain}</strong><small>{count}/2</small></header>
              <div className="council-initiative-list">
                {items.map((initiative) => {
                  const selected = decisions.find((decision) => decision.initiativeId === initiative.id);
                  return <article className={`council-initiative ${selected ? 'is-selected' : ''}`} key={initiative.id}>
                    <button className="council-initiative-toggle" aria-pressed={Boolean(selected)} onClick={() => toggle(initiative.id)} disabled={!selected && decisions.length >= 5}>
                      <span className="council-check">{selected ? <Check size={14} /> : initiative.id.slice(1)}</span>
                      <span className="council-initiative-copy"><strong>{initiative.name}</strong><small>{initiative.description}</small><small className="council-scope">{initiative.scope === 'city' ? 'Весь город' : 'Один район'} · лаг {initiative.lag} кв.</small></span>
                      <b>{initiative.cost}</b>
                    </button>
                    {selected && initiative.scope === 'district' && <label className="council-district-select">Район<select value={selected.districtId} onChange={(event) => setDistrict(initiative.id, event.target.value as DistrictId)}>{districts.map((district) => <option value={district.id} key={district.id}>{district.name}</option>)}</select></label>}
                  </article>;
                })}
              </div>
            </section>;
          })}
        </div>

        <div className="council-budget-panel">
          <div className="council-budget-copy"><span className="council-kicker">ОБЩИЙ ВИРТУАЛЬНЫЙ БЮДЖЕТ</span><strong>{money(validation.cost)} <small>из 100</small></strong><span>{money(Math.max(0, BUDGET - validation.cost))} остаётся</span></div>
          <div className="council-budget-meter"><div><span style={{ width: `${percent}%` }} /></div><small>{decisions.length} из 5 решений выбрано</small></div>
          <div className={`council-validation ${validation.valid ? 'is-valid' : decisions.length === 5 ? 'has-error' : ''}`}>
            {validation.valid ? <><Check size={17} /> Набор допустим — прогноз обновлён</> : decisions.length === 5 && validation.errors.length ? <><Info size={17} /> {validation.errors[0]}</> : <><Info size={17} /> Выбрано {decisions.length} из 5 мер — выберите ещё {Math.max(0, 5 - decisions.length)}</>}
          </div>
        </div>
      </section>

      {result && weakest ? <>
        <section className="council-result" aria-live="polite">
          <div className="council-result-title"><span className="council-kicker">02 / ПРОГНОЗ ПОСЛЕДСТВИЙ</span><h2>Astana Quality of Life Score</h2><p>Расчётный учебный индекс, а не официальный показатель города.</p></div>
          <div className="council-score-row">
            <div className="council-score-card"><strong>{format(result.score)}<small>/ 100</small></strong><span className={result.change >= 0 ? 'score-up' : 'score-down'}>{result.change >= 0 ? <ArrowUpRight size={17} /> : <ArrowDownRight size={17} />}{format(result.change)} к исходному уровню {format(52.56)}</span></div>
            <div className="council-stat-card"><small>СРЕДНЕЕ ПО ГОРОДУ</small><strong>{format(result.average)}</strong><span>с учётом доли населения</span></div>
            <div className="council-stat-card"><small>СЛАБЕЙШИЙ РАЙОН</small><strong>{weakest.name}</strong><span>индекс {format(result.minimum)} / 100</span></div>
            <div className="council-stat-card"><small>КРИТИЧНЫХ ЗНАЧЕНИЙ</small><strong>{result.criticalCount}</strong><span>показателей ниже 40</span></div>
          </div>
          <div id="how-it-works" className="council-formula"><Sparkles size={17} /><div><strong>Как получен балл</strong><p>Score = 0,7 × средний индекс города + 0,3 × индекс слабейшего района − {result.criticalCount} за критические значения. Население задаёт вес районов в среднем; каждый показатель предварительно взвешен по направлению.</p></div></div>
        </section>

        <section className="council-impact-section">
          <div className="council-section-head"><div><span className="council-kicker">03 / РАЙОНЫ И ПОКАЗАТЕЛИ</span><h2>Что изменится на местах</h2></div><span className="council-horizon">Горизонт модели: 8 кварталов</span></div>
          <div className="council-district-grid">
            {districts.map((district) => {
              const scoreChange = result.districtScores[district.id] - (indicators.reduce((sum, indicator) => sum + district.values[indicator.id] * indicator.weight, 0));
              return <details className={`council-district-card ${district.id === result.weakestDistrict ? 'is-weakest' : ''}`} key={district.id} open={district.id === result.weakestDistrict}>
                <summary><span><strong>{district.name}</strong><small>{district.id === result.weakestDistrict ? 'Слабейший район' : `${Math.round(district.population * 100)}% населения`}</small></span><b>{format(result.districtScores[district.id])}<i className={scoreChange >= 0 ? 'score-up' : 'score-down'}>{scoreChange >= 0 ? '+' : ''}{format(scoreChange)}</i></b></summary>
                <div className="council-indicator-list">{indicators.map((indicator) => {
                  const before = result.before[district.id][indicator.id];
                  const after = result.after[district.id][indicator.id];
                  const change = result.deltas[district.id][indicator.id];
                  return <div className="council-indicator" key={indicator.id}><div><span>{indicator.id}</span><small>{indicator.name}</small><b>{format(before)} <i>→</i> {format(after)}</b></div><div className="council-indicator-track"><span style={{ width: `${after}%` }} /></div><em className={change > 0 ? 'score-up' : change < 0 ? 'score-down' : ''}>{change > 0 ? '+' : ''}{format(change)}</em></div>;
                })}</div>
              </details>;
            })}
          </div>
        </section>

        <section className="council-explanation">
          <div className="council-explanation-icon"><Sparkles size={20} /></div>
          <div><span className="council-kicker">04 / ИНТЕРПРЕТАЦИЯ РЕЗУЛЬТАТА</span><h2>{result.change >= 0 ? 'Сценарий улучшает городской индекс' : 'Сценарий снижает городской индекс'}</h2><p>Score изменился на {format(result.change)} пункта относительно базовых {format(52.56)}. На итог влияют среднее по населению, положение {weakest.name} как слабейшего района и {result.criticalCount} критических значений (показатели ниже 40). {weakestIndicator && <>Наиболее низкий показатель сейчас — «{weakestIndicator.indicator.name}» в районе {weakestIndicator.district.name}: {format(weakestIndicator.value)}.</>}</p></div>
        </section>
      </> : <section className="council-empty-result"><span className="council-empty-score">—</span><div><h2>Результат появится после выбора пяти мер</h2><p>Числа не рассчитываются для неполного или недопустимого набора. Исправьте подсказку над этим блоком.</p></div></section>}

              <section className="ain-advisors" id="council">
          <div className="ain-advisor-heading"><span className="ain-overline"><i /> ПРАВИЛА МОДЕЛИ / 05 НАПРАВЛЕНИЙ</span><h2>Городской совет</h2><p>Пять направлений анализируют один сценарий. Выводы формируются из уже посчитанных показателей — без генеративной модели и неподтверждённых цифр.</p></div>
          <div className="ain-advisor-grid">{domains.map((domain, index) => {
            const selectedInDomain = decisions.filter((decision) => initiatives.find((initiative) => initiative.id === decision.initiativeId)?.domain === domain);
            const domainImpact = result ? districts.reduce((districtSum, district) => districtSum + district.population * indicators.filter((indicator) => indicator.domain === domain).reduce((sum, indicator) => sum + result.deltas[district.id][indicator.id] * indicator.weight, 0), 0) : 0;
            return <article className="ain-advisor-card" key={domain} style={{ '--domain-color': domainColors[domain] } as React.CSSProperties}><div className="ain-agent-avatar"><span>0{index + 1}</span><i>{domain.slice(0, 1)}</i></div><div className="ain-agent-copy"><small>НАПРАВЛЕНИЕ · {domain.toUpperCase()}</small><strong>{format(domainImpact)} <em>к среднему индексу</em></strong><p>{selectedInDomain.length ? `В сценарии ${selectedInDomain.length} ${selectedInDomain.length === 1 ? 'мера' : 'меры'} по направлению «${domain}». Эффект рассчитан по показателям и доле населения районов.` : `Мер по направлению «${domain}» в текущем наборе нет. Оцените этот пробел при следующем выборе.`}</p></div></article>;
          })}</div>
          <div className="ain-akim-verdict"><div className="ain-akim-mark">A</div><div><span className="ain-overline">ВЕРДИКТ АКИМА</span><p>{result ? `Городской индекс ${result.change >= 0 ? 'растёт' : 'снижается'} на ${format(Math.abs(result.change))} пункта. Самый слабый район — ${weakest?.name ?? '—'}; ${result.criticalCount ? `осталось ${result.criticalCount} критических показателя.` : 'критических показателей ниже 40 не осталось.'}` : 'Соберите допустимый набор из пяти решений, чтобы получить итоговый вердикт.'}</p></div><a href="#simulator" className="ain-verdict-link">К сценариям <ArrowUpRight size={15} /></a></div>
        </section><footer className="council-footer"><p><Info size={15} /> Учебная модель на синтетических данных. Баллы не являются официальной оценкой Астаны или обещанием реального эффекта. Неизрасходованный бюджет не даёт бонуса.</p><span>AKIM <i>·</i> МОДЕЛЬ 1.0</span></footer>
    </main>
  );
}







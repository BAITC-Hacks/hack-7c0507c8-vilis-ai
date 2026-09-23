import { describe, expect, it } from 'vitest';
import { answerProjectQuestion, buildProjectPlan, demoProjectDraft, formatKZT, newProjectDraft, projectDomains, projectProfiles, validateProjectDraft } from '../lib/akim/project-planner';

describe('city project planner', () => {
  it('starts with a 100 million tenge demonstration project and an honest data warning', () => {
    const plan = buildProjectPlan(demoProjectDraft);
    expect(plan.draft.budgetKZT).toBe(100_000_000);
    expect(plan.gate.status).toBe('demo-source');
    expect(plan.gate.title).toContain('источник');
    expect(plan.amountPerSiteKZT).toBe(8_333_333);
  });

  it('starts a new project as an explicit draft that cannot be mistaken for verified city data', () => {
    const plan = buildProjectPlan(newProjectDraft);
    expect(plan.gate.status).toBe('missing-problem');
    expect(plan.gate.title).toContain('проблему');
    expect(plan.targetImproves).toBeNull();
  });

  it('allocates every tenge, including rounding remainders, and keeps reserve uncommitted', () => {
    for (const budgetKZT of [100_000_000, 100_000_003, 1]) {
      const plan = buildProjectPlan({ ...demoProjectDraft, budgetKZT });
      expect(plan.stages.reduce((sum, stage) => sum + stage.amountKZT, 0)).toBe(budgetKZT);
      expect(plan.stages.reduce((sum, stage) => sum + stage.percent, 0)).toBe(100);
      expect(plan.stages[5].startMonth).toBeNull();
      expect(plan.stages[5].amountKZT).toBeGreaterThanOrEqual(0);
    }
  });

  it('creates a complete, continuous schedule for the selected horizon', () => {
    for (const durationMonths of [6, 12, 36]) {
      const plan = buildProjectPlan({ ...demoProjectDraft, durationMonths });
      const workStages = plan.stages.filter((stage) => stage.startMonth !== null);
      expect(workStages[0].startMonth).toBe(1);
      expect(workStages.at(-1)?.endMonth).toBe(durationMonths);
      expect(workStages.every((stage, index) => index === 0 || stage.startMonth === workStages[index - 1].endMonth! + 1)).toBe(true);
    }
  });

  it('rejects missing problem context and invalid budget, scale, or timeline', () => {
    const validation = validateProjectDraft({ ...demoProjectDraft, title: '', problem: 'too short', budgetKZT: 0, scope: 0, durationMonths: 5 });
    expect(validation.valid).toBe(false);
    expect(validation.errors).toHaveLength(5);
    expect(() => buildProjectPlan({ ...demoProjectDraft, budgetKZT: -1 })).toThrow('Бюджет');
  });

  it('does not mark a reversed or equal KPI target as an improvement', () => {
    const reversed = buildProjectPlan({ ...demoProjectDraft, baseline: 34, target: 36, dataSource: 'Городская система измерений' });
    const equal = buildProjectPlan({ ...demoProjectDraft, baseline: 34, target: 34 });
    expect(reversed.targetImproves).toBe(false);
    expect(reversed.gate.status).toBe('invalid-target');
    expect(equal.gate.status).toBe('invalid-target');
  });

  it('recognizes improvement direction per domain and still marks sources for human review', () => {
    const ecology = buildProjectPlan({ ...demoProjectDraft, domain: 'Экология', baseline: 72, target: 85, dataSource: 'Посадочный реестр, проверен 2026-09-01' });
    expect(ecology.targetImproves).toBe(true);
    expect(ecology.gate.status).toBe('review');
    expect(projectDomains).toHaveLength(5);
    expect(Object.keys(projectProfiles)).toHaveLength(5);
  });

  it('answers concrete questions from the current project plan without external data', () => {
    const plan = buildProjectPlan(demoProjectDraft);
    expect(answerProjectQuestion('Какие технологии использовать?', plan)).toContain('QGIS + PostGIS');
    expect(answerProjectQuestion('Как запустить проект?', plan)).toContain('месяцев');
    expect(answerProjectQuestion('Как проверить эффект?', plan)).toContain('коридором без изменений');
    expect(answerProjectQuestion('Сколько стоит?', plan)).toContain(formatKZT(100_000_000));
    expect(answerProjectQuestion('Что решает проект?', plan)).toContain('задержки');
    expect(answerProjectQuestion('Какой неизвестный параметр?', plan)).toContain('не выдумывая внешние данные');
  });
});

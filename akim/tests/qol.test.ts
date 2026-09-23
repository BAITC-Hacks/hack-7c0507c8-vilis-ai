import { describe, expect, it } from 'vitest';
import { BUDGET, baselineResult, calculate, districts, initialDecisions, initiatives, validateDecisions, type Decision } from '../lib/akim/qol';

const decision = (initiativeId: string, districtId?: Decision['districtId']): Decision => ({ initiativeId, ...(districtId ? { districtId } : {}) });
const cheapest: Decision[] = [decision('M9', 'nura'), decision('M11', 'nura'), decision('M10', 'nura'), decision('M12'), decision('M4', 'saryarka')];

describe('Astana Quality of Life model', () => {
  it('uses the fixed budget, five districts and fourteen measures', () => {
    expect(BUDGET).toBe(100);
    expect(districts).toHaveLength(5);
    expect(initiatives).toHaveLength(14);
  });

  it('reproduces the specified baseline score', () => {
    expect(baselineResult.score).toBeCloseTo(52.56, 2);
    expect(baselineResult.criticalCount).toBe(2);
  });

  it('reproduces the golden five-measure scenario', () => {
    const result = calculate(initialDecisions);
    expect(result.cost).toBe(95);
    expect(result.score).toBeCloseTo(56.5, 1);
    expect(result.change).toBeCloseTo(4, 0);
    expect(result.deltas.nura.B1).toBeCloseTo(12.5);
  });

  it('accepts the cheapest golden scenario at 61 units', () => {
    expect(validateDecisions(cheapest)).toMatchObject({ valid: true, cost: 61 });
    expect(calculate(cheapest).cost).toBe(61);
  });

  it('requires exactly five decisions and enforces the budget and direction limit', () => {
    expect(validateDecisions(cheapest.slice(0, 4)).valid).toBe(false);
    const overBudget = [decision('M3', 'nura'), decision('M6'), decision('M7', 'nura'), decision('M8', 'nura'), decision('M13', 'nura')];
    expect(validateDecisions(overBudget).errors[0]).toContain('бюджет');
    const tooManyInOneDomain = [decision('M1', 'nura'), decision('M2'), decision('M3', 'saryarka'), decision('M4', 'baikonur'), decision('M7', 'almaty')];
    expect(validateDecisions(tooManyInOneDomain).errors.join(' ')).toContain('больше двух');
  });

  it('rejects incompatible combinations and duplicate measures', () => {
    const transportConflict = [decision('M1', 'nura'), decision('M3', 'saryarka'), decision('M4', 'almaty'), decision('M7', 'baikonur'), decision('M12')];
    expect(validateDecisions(transportConflict).errors.join(' ')).toContain('M1 и M3');
    const districtConflict = [decision('M4', 'nura'), decision('M7', 'nura'), decision('M8', 'saryarka'), decision('M10', 'baikonur'), decision('M12')];
    expect(validateDecisions(districtConflict).errors.join(' ')).toContain('одном районе');
    expect(validateDecisions([decision('M9', 'nura'), decision('M9', 'nura'), ...cheapest.slice(2, 5)]).errors.join(' ')).toContain('Повторно');
  });

  it('applies city measures to all districts and gives fixed synergies', () => {
    const result = calculate(initialDecisions);
    expect(result.deltas.yesil.C2).toBeCloseTo(4.375);
    expect(result.deltas.nura.B1).toBeCloseTo(12.5);
  });
});


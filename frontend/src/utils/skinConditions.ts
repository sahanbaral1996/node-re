import { ESkinCondition } from 'types/personalizedSolution';
import { acne, finelines, masknee, melasma, pigmentation, rosacea, skintexture } from 'assets/images';

export const SKIN_ISSUES = new Map();

SKIN_ISSUES.set('acne', { img: acne, label: 'Acne' });
SKIN_ISSUES.set('fineLinesandWrinkles', { img: finelines, label: 'Fine Lines and Wrinkles' });
SKIN_ISSUES.set('hyperpigmentation', { img: pigmentation, label: 'Hyperpigmentation' });
SKIN_ISSUES.set('maskne', { img: masknee, label: 'Masknee' });
SKIN_ISSUES.set('melasma', { img: melasma, label: 'Melasma' });
SKIN_ISSUES.set('rosacea', { img: rosacea, label: 'Rosacea' });
SKIN_ISSUES.set('skinTextureorFirmness', { img: skintexture, label: 'Skin Texture or Firmness' });

export const getIssueValue = (issueName: ESkinCondition) => {
  const selectedIssue = SKIN_ISSUES.get(issueName) || {};

  return (key: string) => selectedIssue[key] || '';
};

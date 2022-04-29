import { SkinType, SkinTypes } from 'types/assessment';
import { AssessmentFormValues } from 'components/clinicalAssessment/Assessment/assessment.config';

type CustomerCreationValues = AssessmentFormValues;

export const toJson = (value: CustomerCreationValues) => {
  const {
    genderIdentity,
    healthCondition,
    medication,
    oralMedication,
    allergy,
    menstrualPeriod,
    otherMedication,
    prescriptionDuringPregnancy,
    primaryConcerns,
    topicalProducts,
    topicalRetinoid,
    treatmentHistory,
    skinType,
  } = value;

  const otcMedications = formatOtcMedication(topicalProducts);
  const primaryConcernsObj = formatPrimaryConcerns(primaryConcerns);
  const formattedSkinType = formatSkinType(skinType);

  const specificMedication = medication.specificMedication;
  const opposedToAnyMedication = medication.opposedToAnyMedication;

  const medicationAllergy = allergy.medications;
  const mushroomAllergy = allergy.mushrooms;

  return {
    genderIdentity,
    menstrualPeriod,
    prescriptionDuringPregnancy,
    topicalRetinoid,
    treatmentHistory,
    healthCondition,
    specificMedication,
    oralMedication,
    opposedToAnyMedication,
    medicationAllergy,
    mushroomAllergy,
    otherMedication,
    ...otcMedications,
    ...primaryConcernsObj,
    ...formattedSkinType,
  };
};

const formatOtcMedication = (data: any) => {
  const NOT_APPLICABLE = 'Not applicable' as const;
  const medications: any = {};

  for (const otcMedicationKey in data) {
    if (Object.prototype.hasOwnProperty.call(data, otcMedicationKey) && !/Description/.test(otcMedicationKey)) {
      const [otcMedication] = data[otcMedicationKey];

      if (otcMedicationKey === 'none') {
        continue;
      }

      if (otcMedication) {
        const description = data[`${otcMedicationKey}Description`];

        medications[otcMedicationKey] = description;
      } else {
        medications[otcMedicationKey] = NOT_APPLICABLE;
      }
    }
  }

  return medications;
};

const formatPrimaryConcerns = (concerns: string[]) => {
  const concernsObj: any = {};

  const concernsMap: any = {
    '1': 'Acne',
    '2': 'Hyperpigmentation',
    '3': 'Skin texture and firmness',
    '4': 'Rosacea',
    '5': 'Melasma',
    '6': 'Maskne',
    '7': 'Fine lines and wrinkles',
  };

  for (let i = 1; i <= 7; i++) {
    const concern: string = concernsMap[i];

    concernsObj[`primarySkinConcernChoice${i}`] = concerns.includes(concern);
  }

  return concernsObj;
};

const formatSkinType = (skinType: SkinType): { skinType: SkinTypes | undefined; skinSensitivity: string } => {
  const SKIN_TYPE_RATING = new Map<number, SkinTypes>([
    [1, SkinTypes.VeryDry],
    [2, SkinTypes.Dry],
    [3, SkinTypes.Combination],
    [4, SkinTypes.Oily],
    [5, SkinTypes.VeryOily],
  ]);

  return {
    skinType: SKIN_TYPE_RATING.get(Number.parseInt(skinType.type, 10)),
    skinSensitivity: skinType.sensitivity,
  };
};

import { HydroQuinoneKeys, RetinoidKeys } from 'types/reassessment';

export const toJson = (value: any) => {
  const {
    hydroquinone,
    lifestyleChanges,
    newMedication,
    pregnancyInThreeMonths,
    rednessIrritationPeeling,
    rednessIrritationScale,
    retinoidsSideEffects,
    skinResponseToCurrentRegimen,
    currentCondition,
    selfies,
  } = value;

  const hydroquinoneData: HydroQuinoneKeys = {
    darkeningOfSpots: 'No',
    fishyTasteOrSmell: 'No',
    orangeDiscoloration: 'No',
    notCurrentlyPrescribed: 'No',
  };

  const retinoidData: RetinoidKeys = {
    increasedSunSensitivity: 'No',
    rashRedness: 'No',
    notCurrentlyPrescribed: 'No',
  };

  const getResult = (object: any, data: Array<string>) => {
    let result: any = {};

    Object.keys(object).forEach((value: any) => {
      if (data.includes('noneOfTheAbove')) {
        result = { ...object, ...result, [value]: 'Not applicable' };
      } else if (data.includes(value)) {
        result = { ...object, ...result, [value]: 'Yes' };
      } else {
        result = { ...object, ...result, [value]: 'No' };
      }

      result = { ...object, ...result };
    });

    return result;
  };

  const data: any = {
    hydroquinone: getResult(hydroquinoneData, hydroquinone),
    rednessIrritationPeelingStatus: rednessIrritationPeeling,
    rednessIrritationPeelingRating: rednessIrritationScale?.rating?.toString() || '',
    rednessIrritationPeelingLocation: rednessIrritationScale?.description || '',
    newMedication: newMedication.value,
    newMedicationType: newMedication.description,
    pregnancyInThreeMonths: pregnancyInThreeMonths,
    currentCondition: currentCondition,
    retinoidsSideEffects: getResult(retinoidData, retinoidsSideEffects),
    skinResponseToCurrentRegimen: `${skinResponseToCurrentRegimen.rating.toString()}`,
    selfies: selfies,
  };

  return data;
};

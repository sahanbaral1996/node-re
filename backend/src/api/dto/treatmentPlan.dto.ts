enum RegimentTime {
  Anytime = 'ANYTIME',
  Morning = 'MORNING',
  Evening = 'EVENING',
}

export const getRoutine = (regimentTime: string): RegimentTime => RegimentTime[regimentTime];

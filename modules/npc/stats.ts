export function calculateLevel(levelType = 'random') {
  switch (levelType) {
  case 'randomPeasantsMostly': {
    const randomValue = Math.floor(30 / (Math.random() * 150 + 1) + 1);
    return randomValue > 20 ? 20 : randomValue;
  }
  default:
    return Math.floor(Math.random() * 20 + 1);
  }
}

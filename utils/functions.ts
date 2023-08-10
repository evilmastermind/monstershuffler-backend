function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDecimal(min: number, max: number, distribution?: 'beginning' | 'middle' | 'end'): number {
  let randomValue = Math.random();

  switch (distribution) {
  case 'beginning':
    randomValue = Math.sqrt(randomValue);
    break;
  case 'middle':
    randomValue = Math.random() * Math.random();
    break;
  case 'end':
    randomValue = 1 - Math.sqrt(1 - randomValue);
    break;
  default: // This covers the undefined case where we just want a uniform distribution
    break;
  }
  return randomValue * (max - min) + min;
}

function round2Decimals(value: number): number {
  return Math.round(value * 100) / 100;
}


export { random, randomDecimal, round2Decimals };

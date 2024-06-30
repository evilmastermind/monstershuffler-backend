function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function randomDecimal(minValue: number, maxValue: number, distribution: 'beginning' | 'middle' | 'end' | undefined = undefined, samples = 12): number {
  let result = 0;
  const range = maxValue - minValue;

  if (distribution === undefined) {
    return Math.random() * (maxValue - minValue) + minValue;
  }
  if (distribution === 'middle') {
    // Use Central Limit Theorem for middle bias
    let sum = 0;
    for (let i = 0; i < samples ; i++) { // 12 samples to balance simplicity and accuracy
      sum += Math.random();
    }
    // Normalize to range and adjust to minValue
    result = ((sum - (samples / 2)) / (samples / 2)) * range / 2 + (minValue + range / 2);
  } else {
    const randomValue = Math.random(); // Generate a single random value
    if (distribution === 'beginning') {
      // Square the random value to bias towards the beginning
      result = minValue + Math.pow(randomValue, 2) * range;
    } else if (distribution === 'end') {
      // Use square root to bias towards the end
      result = minValue + Math.sqrt(randomValue) * range;
    }
  }

  return result;
}

// function randomDecimal(min: number, max: number, distribution?: 'beginning' | 'middle' | 'end'): number {
//   let randomValue = Math.random();

//   switch (distribution) {
//   case 'beginning':
//     randomValue = Math.sqrt(randomValue);
//     break;
//   case 'middle':
//     randomValue = randomValue ** 2;
//     return ((max - min) / 2) ;
//     break;
//   case 'end':
//     randomValue = 1 - Math.sqrt(1 - randomValue);
//     break;
//   default: // This covers the undefined case where we just want a uniform distribution
//     break;
//   }
//   return randomValue * (max - min) + min;
// }

function round2Decimals(value: number): number {
  return Math.round(value * 100) / 100;
}


export { random, randomDecimal, round2Decimals };

export function findChoices(object: any, father: object | Array<object>, fathersKey: string | number) {
  if (typeof object === 'object') {
    if (Array.isArray(object)) {
      object.forEach((value, index) => {
        findChoices(value, object, index);
      });
    } else if (typeof object === 'object') {
      Object.entries(object).forEach(([key]) => {
        if(key === 'choice') {
          resolveChoice(object, father, fathersKey);
        } else {
          findChoices(object[key], object, key);
        }
      });
    }
  }
}

function resolveChoice(object: any, father: object, fathersKey: string | number) {
  console.log(JSON.stringify(object,null,2));
}

/* missing in action (lol)
- tag
- check the converted profession actions inside psql, they don't seem to have
  all the fields yet
- also, for those actions, you need to convert filters with filtersObject
- also, check if the randomChoice format is correct
*/

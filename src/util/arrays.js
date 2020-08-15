function removeDuplicates(arrayOne, arrayTwo) {
  const result = [];

  let i = 0;
  let j = 0;
  while (i < arrayOne.length && j < arrayTwo.length) {
    const docOne = arrayOne[i].data();
    const docTwo = arrayTwo[j].data();
    if (
      docOne.startTime.toMillis() === docTwo.startTime.toMillis() &&
      docOne.endTime.toMillis() === docTwo.endTime.toMillis()
    ) {
      i += 1;
      j += 1;
      result.push(docTwo);
    } else if (docOne.startTime.toMillis() > docTwo.startTime.toMillis()) {
      j += 1;
      result.push(docTwo);
    } else if (docOne.startTime.toMillis() < docTwo.startTime.toMillis()) {
      i += 1;
      result.push(docOne);
    } else {
      i += 1;
      j += 1;
      result.push(docOne);
      result.push(docTwo);
    }
  }

  while (i < arrayOne.length) {
    result.push(arrayOne[i].data());
    i += 1;
  }

  while (j < arrayTwo.length) {
    result.push(arrayTwo[j].data());
    j += 1;
  }

  return result;
}

function compareEvents(a, b) {
  const dataA = a.data();
  const dataB = b.data();
  if (dataA.startTime.toMillis() < dataB.startTime.toMillis()) {
    return -1;
  }
  if (dataA.startTime.toMillis() > dataB.startTime.toMillis()) {
    return 1;
  }
  return 0;
}

module.exports = {
  removeDuplicates,
  compareEvents,
};

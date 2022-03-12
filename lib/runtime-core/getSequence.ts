export const getSequence = (arr) => {
  const subIndices = [0];
  const preIndices = [...arr];
  for (let i = 0; i < arr.length; i++) {
    const arrI = arr[i];
    if (arrI === 0) {
      // 0 is initial value
      continue;
    }
    const lastIndex = subIndices[subIndices.length - 1];
    if (arrI > arr[lastIndex]) {
      preIndices[i] = lastIndex;
      subIndices.push(i);
    } else {
      // subsequence is ordered array, can use binary search
      let start = 0;
      let end = subIndices.length - 1;
      // 0 <= 1
      // [1, 2] mid will always 1 and end is 1, it will cause infinite loop
      while (start < end) {
        // this must be Math.floor
        const mid = Math.floor((start + end) / 2);
        if (arrI < arr[subIndices[mid]]) {
          // If this cause infinite loop
          end = mid;
        } else {
          start = mid + 1;
        }
      }
      // find the smallest one that larger then target
      if (arrI < arr[subIndices[start]]) {
        // may replace first one
        if (start > 0) {
          preIndices[i] = subIndices[start - 1];
        }
        subIndices[start] = i;
      }
    }
  }
  const len = subIndices.length;
  let lastIndex = subIndices[len - 1];
  for (let i = len - 1; i >= 0; i--) {
    subIndices[i] = lastIndex;
    lastIndex = preIndices[lastIndex];
  }
  return subIndices;
};

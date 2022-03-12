// think: greedy + binary search
// 1. 创建一个数组result，用来生成最终的 最长递增子序列
// 2. 遍历传入的数组，如果当前元素比result重的最后一项还大，直接push到result中
// 3. 如果当前元素比最后一项小，那么用当前元素替换result中比当前元素大的元素中最小的一个
//    3.1 由于result为一个有序数组，所以可以使用二分查找来查找元素
// 1 8 5 3 4 9 7 6 2
// 1
// 1 8
// 1 5
// 1 3
// 1 3 4
// 1 3 4 9
// 1 3 4 7
// 1 3 4 6
// 1 2 4 6 (结果是错的，长度时对的)

// 最终结果： 1 3 4 6
// 为了让最终结果正确，每次向result中插入元素时，要记录它要插入位置的前一个元素的索引
// record previous position index: https://excalidraw.com/#json=l2REtzUL8YmPWc_VFykGp,j3Ot6Dbp1RHK2JapaaAfJA
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

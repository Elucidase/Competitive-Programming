/*
LeetCode problem: Median of Two Sorted Arrays
There are two sorted arrays nums1 and nums2 of size m and n respectively.
Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).
You may assume nums1 and nums2 cannot be both empty.
*/
let findMedianSortedArrays = function(nums1, nums2) {
    let index1, index2, result1, result2;
    let length = nums1.length + nums2.length;
    index1 = Math.ceil(length / 2);
    if(length % 2 === 0) index2 = index1 + 1;
    result1 = search(nums1, index1) || search(nums2, index1);
    if(index2) result2 = search(nums1, index2) || search(nums2, index2);
    return (index2? (result1 + result2) / 2: result1);
    function search(array, index) {
        if(array.length === 0) return null;
        let left = 0, right = array.length - 1;
        let middle;
        let lowRank = rank(array[0]);
        let highRank = rank(array[array.length - 1]);
        if(lowRank[0] >= index || highRank[1] < index) return null;
        if(lowRank[0] < index && lowRank[1] >= index) return array[0];
        if(highRank[0] < index && highRank[1] >= index) return array[array.length - 1];
        while(right - left > 1) {
            middle = Math.floor((left + right) / 2);
            let [lessThan, lessEqThan] = rank(array[middle]);
            if(lessThan >= index) right = middle;
            else if(lessEqThan < index) left = middle;
            else {
                return array[middle];
            }
        }
        return null;
    }
    function rank(num) {
        let [low1, high1] = numLess(nums1, num);
        let [low2, high2] = numLess(nums2, num);
        return [low1 + low2, high1 + high2];
    }
    function numLess(array, number) {
        let left = 0, right = array.length - 1;
        let middle;
        if(array.length === 0 || number < array[0]) return [0, 0];
        else if (number == array[0]) return boundary(array, 0);
        else if (number == array[array.length - 1]) return boundary(array, array.length - 1);
        else if (number > array[array.length - 1]) return [array.length, array.length];
        while(right - left > 1) {
            middle = Math.floor((left + right) / 2);
            if(array[middle] > number) right = middle;
            else if(array[middle] < number) left = middle;
            else if (array[middle] === number) {
                return boundary(array, middle);
            }
        }
        return [left + 1, left + 1];
        function boundary(array, index) {
            let low = index, high = index;
            while(array[low - 1] && array[low - 1] === array[low]) low--;
            while(array [high + 1] && array[high + 1] === array[high]) high++;
            return [low, high + 1];
        }
    }
};

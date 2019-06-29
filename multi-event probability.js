function probDstr(pEvents) {
  let result = [];
  for(let i = 0; i <= pEvents.length; i++) {
    let prob = generateIndices(pEvents.length, i).reduce((sum, indices) => {
      return sum + pEvents.map((each, index) => {
        if(indices.indexOf(index) === -1) return 1 - pEvents[index];
        else return pEvents[index];
      }).reduce((prod, event) => prod * event, 1);
    }, 0);
    result.push(prob);
  }
  function generateIndices(dimen, combine) {
    function growArray(existed, elsToAdd, maxIndex) {
      let output = [];
      if(elsToAdd < 1) return [[-1]];
      if(elsToAdd === 1) {
        for(let i = maxIndex + 1; i < dimen; i++) {
          output.push(existed.concat([i]));
        }
        return output;
      }
      for(let i = maxIndex + 1; i < dimen - elsToAdd + 1; i++) {
        let newExisted = existed.concat([i]);
        output = output.concat(growArray(newExisted, elsToAdd - 1, i));
      }
      return output;
    }
    return growArray([], combine, -1);
  }
  return result;
}

//Example, probability of each individual event
const pEvents = [0.96, 0.7, 0.5, 0.8, 0.95, 0.8, 0.9, 0.7];
probDstr(pEvents);
/*expected output, a possibility distribution table of number of events that would happen:
[
0:	3.6000000000000047e-7
1:	0.00002364000000000002
2:	0.0005850400000000001
3:	0.00702616
4:	0.04526100000000003
5:	0.16314604000000005
6:	0.32545216
7:	0.32980416
8:	0.12870144
]
*/

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

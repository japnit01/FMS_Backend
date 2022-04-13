
function createRivals(arr) {

    let duals = [];

    for(let i=0;i<arr.length-1;i+=2) {
        // console.log(arr[i])
        duals.push([arr[i],arr[i+1]]);
    
    }

    return duals;
}

module.exports = createRivals;

function createRivals(arr) {


    let duels = [];

    for(let i=0;i<arr.length-1;i+=2) {
        duels.push([arr[i].name,arr[i+1].name]);
    }

    return duels;
}

module.exports = createRivals;
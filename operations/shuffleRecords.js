
function shuffle(arr) {

    let duels = [];
    
    for(let i=0;i<arr.length;i++) {
        let index = Math.random() * arr.length;
        [arr[i],arr[index]] = [arr[index],arr[i]];
    }

    for(let i=0;i<arr.length-1;i+=2) {
        duels.push([arr[i],arr[i+1]]);
    }

    return duels;
}

module.exports = shuffle;
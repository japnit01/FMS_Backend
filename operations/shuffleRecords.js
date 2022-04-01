
function shuffle(arr) {
    
    for(let i=0;i<arr.length;i++) {
        let index = Math.random() * arr.length;
        swap(arr[i],arr[index]);
    }
}

module.exports = shuffle;
// import fetch from "node-fetch"

const someList = [
    {
        "name": "bulbasaur",
        "id": 1,
        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    },
    {
        "name": "ivysaur",
        "id": 2,
        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png"
    },
]

// Function to randomize the indexes/positions and double list items.
const doubleListItems = (someList) => {
     // Make a copy of the list
    const listCopy = [...someList]
    // Dict to count the number of occurances of items
    const itemCountDict = {}
    const originalListSize = someList.length
    // Empty array to hold doubled items
    const newList = new Array(originalListSize * 2)
    let i = 0
    while (i < originalListSize * 2) {
        // Pick a random index to insert item into
        const idx = Math.floor(Math.random() * (newList.length))
        // Pick a random index of an item
        const randIndex = Math.floor(Math.random() * listCopy.length)
        // Check if dict does not contain item, add item to dictionary and initialize it to 0
        if (!itemCountDict[listCopy[randIndex].name]){
            itemCountDict[listCopy[randIndex].name] = 0
        }
        // Check if dict contains item and count is less than 2
        if (itemCountDict[listCopy[randIndex].name] < 2){
            // If the newList index has already has an item, do nothing. Continue loop.
            // Else insert item at index and increment the item's occurence in the dictionary
            if (newList[idx] !== undefined) {
                continue
            }
            newList[idx] = {...listCopy[randIndex]}
            itemCountDict[listCopy[randIndex].name]++
            i++
        }
    }
    return newList
}

export default doubleListItems
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

const doubleListItems = (someList) => {
    const someListCopy = [...someList]
    const itemDict = {}
    const size = someList.length
    const newList = new Array(size * 2)
    let i = 0
    while (i < size * 2) {
        const randIndex = Math.floor(Math.random() * someListCopy.length)
        if (!itemDict[someListCopy[randIndex].name]){
            itemDict[someListCopy[randIndex].name] = 0
        }
        if (itemDict[someListCopy[randIndex].name] < 2){
            itemDict[someListCopy[randIndex].name]++
            newList[i] = {...someListCopy[randIndex]}
            i++
        }
        
    }
    return newList
}

export default doubleListItems
// fetch("https://eat-right-api-q5n8.onrender.com/api/v1/recipe")
//     .then((response)=>response.json())
//     .then(data => {
//       console.log(data)
//       const newList = doubleListItems(data)
//       console.log(newList)
//     })

// console.log(doubleListItems(someList))
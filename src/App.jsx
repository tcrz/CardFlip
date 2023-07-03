import { useEffect, useState } from "react";
import doubleListItems from "../doubleListItems";
import "./App.css";
import Pokemons from "./components/Pokemons/Pokemons";
import pokemonball from "../pokemonball.png";
import Stats from "./components/Stats/Stats.jsx";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";


// Generate a list of 8 random numbers (which are pokemon Ids) within ranges of 0 - 490
const pokemonIdsList = [...Array(8).keys()].map(i => Math.floor(Math.random() * 490))

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [movesCount, setMovesCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentlySelected, setCurrentlySelected] = useState([]);
  const [pokemonIdsList, setPokemonIdsList] = useState([])
  const [imgsLoaded, setImgsLoaded] = useState(false)
  // const [resetGame, setResetGame] = useState()

  const progressValue = Math.round((completedCount / (pokemonList.length / 2)) * 100) + "%";

  const generatePokemonIds = () => setPokemonIdsList([...Array(8).keys()].map(i => Math.floor(Math.random() * 490)))

  useEffect(() => {
    generatePokemonIds()
  }, [])

  // Preload all images before presenting pokemon cards
  useEffect(() => {
    const loadImage = image => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image()
        loadImg.src = image
       
        loadImg.onload = () =>
          setTimeout(() => {
            resolve(image)
          }, 10)
        loadImg.onerror = err => reject(err)
      })
    }
    Promise.all(pokemonList.map(pokemon => loadImage(pokemon.image)))
      .then(() => setImgsLoaded(true))
      .catch(err => console.log("Failed to load images", err))
  }, [])

  // Fetch details of a pokemon
  const fetchPokemonDetails = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await axios.get(url)
    return response.data
  }

  // console.log(pokemonIdsList)
  const pokemonQueries = useQueries({
    queries: pokemonIdsList.map((id) => {
      return {
        queryKey: ['pokemon', id],
        queryFn: () => fetchPokemonDetails(id),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        cacheTime: Infinity,
      }
    })
  },)

  const pokemonQueriesLoaded = pokemonQueries.every(query => !query.isLoading)
  const pokemonQueriesIsSuccess = pokemonQueries.every(query => query.isSuccess)
  // console.log("pQueries:", pokemonQueries)

  let pokemonDetailsList = [];
  if (pokemonQueriesIsSuccess) {
    console.log("works!")
    let pokemonList = [];
    // Create custom pokemon object for each pokemon and add it to pokemonList
    pokemonQueries.forEach((pokemonData, index) => {
      const pokemon = {}
      pokemon.name = pokemonData.data.name;
      pokemon.default_img = pokemonball
      pokemon.image = pokemonData.data.sprites.other["official-artwork"].front_default;
      pokemon.isFlipped = false
      pokemonList.push(pokemon)
    })
    // Double pokemon and set it to pokemonDetailsList
    pokemonDetailsList = doubleListItems(pokemonList)
    // Assign id to each pokemon
    pokemonDetailsList.forEach((pokemon, index) => {
      pokemon.id = index
    })
  }

  // set pokemon data to state if queries are successfully fetched
  useEffect(() => {
    setPokemonList(pokemonDetailsList)
  }, [pokemonQueriesIsSuccess])

  // If two pokemon have been selected:
  // 1. Increase the moves count
  // 2. if pokemon are the same, increated completed count else reset flipped state
  useEffect(() => {
    if (currentlySelected.length === 2) {
      setMovesCount((prev) => prev + 1);
      setTimeout(() => {
        // console.log("updating");
        if (currentlySelected[0].name === currentlySelected[1].name) {
          setCompletedCount((prev) => prev + 1);
        } else {
          resetFlippedPokemons(currentlySelected);
        }
      }, 500);
    }
  }, [currentlySelected]);

  const manageSelection = (id) => {
    setCurrentlySelected((prev) =>
      prev.length === 2 ? [pokemonList[id]] : [...prev, pokemonList[id]]
    );
  };

  const flipPokemonCard = (id) => {
    const newPokemonList = [...pokemonList];
    newPokemonList.forEach((pokemon) => {
      if (pokemon.id === id) {
        manageSelection(pokemon.id);
        pokemon.isFlipped = true;
      }
    });
    setPokemonList(newPokemonList);
  };

  const resetFlippedPokemons = (SelectedList) => {
    const newPokemonList = [...pokemonList];
    // Set the flipped property of selected pokemon to false and set the updated list to state
    newPokemonList.forEach((pokemon) => {
      if (
        pokemon.id === SelectedList[0].id ||
        pokemon.id === SelectedList[1].id
      ) {
        pokemon.isFlipped = false;
      }
    });
    setPokemonList(newPokemonList);
  };

  const resetGame = () => {
    generatePokemonIds()
    setMovesCount(0)
    setCompletedCount(0)
  }

  return (
    <div className="App">
      <div className="game-container">
        <Stats progressValue={progressValue} completedCount={completedCount} movesCount={movesCount} resetGame={resetGame} />
        {pokemonQueriesLoaded && !pokemonQueriesIsSuccess && <p style={{color: "red"}}>An error occurred.</p>}
        {
          !pokemonQueriesLoaded &&
          <div className="loading-view" style={{ borderr: "1px solid", height: "90%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <p>Loading...</p>
          </div>
        }
        {pokemonQueriesLoaded && pokemonQueriesIsSuccess && imgsLoaded &&
          <Pokemons
            pokemonList={pokemonList}
            setMovesCount={setMovesCount}
            flipPokemonCard={flipPokemonCard}
          />
        }
        {/* <button>Reset game</button> */}
      </div>
    </div>
  );
}

export default App;

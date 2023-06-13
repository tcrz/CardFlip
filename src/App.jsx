import { useEffect, useState } from "react";
import doubleListItems from "../doubleListItems";
import "./App.css";
import Pokemons from "./components/Pokemons/Pokemons";
import pokemonball from "../pokemonball.png";
import Stats from "./components/Stats/Stats.jsx";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

// Generate a number between 1 and 490 (pokemon ids are set in an autoincrementing order, so a number withiin this range will be a pokemon iD)
const randomPokemonId = Math.floor(Math.random() * 490)
// Generate a list of 8 numbers (which are pokemonIds) starting from the randomPokemonId
const pokemonIdsList = [...Array(8).keys()].map(i => randomPokemonId+1 + i)

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [movesCount, setMovesCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentlySelected, setCurrentlySelected] = useState([]);
  // const [resetGame, setResetGame] = useState()

  const progressValue = Math.round((completedCount / (pokemonList.length / 2)) * 100) + "%";

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
  console.log("pQueries:", pokemonQueries)

  let pokemonDetailsList = [];
  if (pokemonQueriesIsSuccess) {
    console.log("works!")
    // try {
    //   const doubledPokemonListData = doubleListItems(pokemonQueries)
    // } catch(err) {
    //   console.log(err)
    // }
    let pokemonList = [];
    pokemonQueries.forEach((pokemonData, index)=>{
      const pokemon = {}
      pokemon.name = pokemonData.data.name;
      pokemon.default_img = pokemonball
      pokemon.image = pokemonData.data.sprites.other["official-artwork"].front_default;
      pokemon.isFlipped = false
      pokemonList.push(pokemon)
    })
    pokemonDetailsList = doubleListItems(pokemonList)
    pokemonDetailsList.forEach((pokemon, index) => {
      pokemon.id = index
    })
    
    // console.log("pokemonList:", pokemonList)
  }

  useEffect(() => {
    setPokemonList(pokemonDetailsList)
  }, [pokemonQueriesIsSuccess])

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

  return (
    <div className="App">
      <div className="game-container">
        <Stats progressValue={progressValue} completedCount={completedCount} movesCount={movesCount}/>
        <div>
          <Pokemons
            pokemonList={pokemonList}
            setMovesCount={setMovesCount}
            flipPokemonCard={flipPokemonCard}
          />
        </div>
        {/* <button>Reset game</button> */}
      </div>
    </div>
  );
}

export default App;

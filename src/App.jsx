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
  // const [resetGame, setResetGame] = useState()

  const progressValue = Math.round((completedCount / (pokemonList.length / 2)) * 100) + "%";

  const generatePokemonIds = () => setPokemonIdsList([...Array(8).keys()].map(i => Math.floor(Math.random() * 490)))

  useEffect(() => {
    generatePokemonIds()
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

  const resetGame = () => {
    generatePokemonIds()
    setMovesCount(0)
    setCompletedCount(0)
  }

  return (
    <div className="App">
      <div className="game-container">
        <Stats progressValue={progressValue} completedCount={completedCount} movesCount={movesCount} resetGame={resetGame}/>
        {
          !pokemonQueriesLoaded && 
          <div className="loading-view" style={{borderr: "1px solid", height: "90%", display: "flex", justifyContent: "space-around", alignItems: "center"}}>
            <p>Loading...</p>
          </div>
        }
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

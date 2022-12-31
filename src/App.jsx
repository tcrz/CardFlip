import { useEffect, useState } from "react";
import doubleListItems from "../doubleListItems";
import "./App.css";
import Pokemons from "./components/Pokemons/Pokemons";
import pokemonball from "../pokemonball.png";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [movesCount, setMovesCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentlySelected, setCurrentlySelected] = useState([]);
  // const [resetGame, setResetGame] = useState()

  const progressValue = Math.round(completedCount / (pokemonList.length / 2) * 100) + "%"

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        const doubledListData = doubleListItems(data);
        doubledListData.forEach((pokemon, index) => {
          pokemon.id = index;
          pokemon.default_img = pokemonball;
          pokemon.isFlipped = false
        });
        setPokemonList(doubledListData);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (currentlySelected.length === 2) {
      setMovesCount((prev) => prev + 1);
      if (currentlySelected[0].name === currentlySelected[1].name){
        setCompletedCount((prev) => prev + 1);
      } else {
        resetFlippedPokemons(currentlySelected), 2000
      }
    }
  }, 500)
  }, [currentlySelected]);

  const manageSelection = (id) => {
    setCurrentlySelected((prev) => (prev.length === 2 ? [pokemonList[id]] : [...prev, pokemonList[id]]));
  };

  const flipPokemonCard = (id) => {
    const newPokemonList = [...pokemonList]
    newPokemonList.forEach((pokemon) => {
      if (pokemon.id === id){
        manageSelection(pokemon.id)
        pokemon.isFlipped = true
      }
    })
    setPokemonList(newPokemonList)
  }

  const resetFlippedPokemons = (SelectedList) => {
    const newPokemonList = [...pokemonList]
    newPokemonList.forEach((pokemon) => {
      if (pokemon.id === SelectedList[0].id || pokemon.id === SelectedList[1].id){
        pokemon.isFlipped = false
      }
    })
    setPokemonList(newPokemonList)
  }

  return (
    <div className="App">
      <div className="game-container">
        <div className="menu">
          <div className="pairs-matched">
            <div className="progress-div">
              <div style={{width: progressValue}} className="progress"/>
            </div>
            <p className="menu-label">Pairs Matched</p>
            <p>
              <span className="result">{completedCount}</span>/8
            </p>
          </div>
          <div className="total-moves">
            <p>Total moves</p>
            <p className="result">{movesCount}</p>
          </div>
        </div>
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

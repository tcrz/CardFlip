import { useEffect, useState } from "react";
import PokemonItem from "../PokemonCard/PokemonCard";
import "./Pokemons.css";

const Pokemons = (props) => {
  return (
    <div className="pokemons">
      {props.pokemonList.map((pokemon) => (
        <PokemonItem
          key={pokemon.id}
          {...pokemon}
          flipPokemonCard={props.flipPokemonCard}
        />
      ))}
    </div>
  );
};

export default Pokemons;

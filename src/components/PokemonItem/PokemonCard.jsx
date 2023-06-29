import "./PokemonCard.css";

const PokemonCard = ({
  id,
  name,
  image,
  default_img,
  isFlipped,
  flipPokemonCard,
}) => {
  return (
    <div className="card-container">
      <div
        className={isFlipped ? "pokemon-card is-flipped" : "pokemon-card"}
        onClick={isFlipped ? () => false : () => flipPokemonCard(id)}
        style={{ cursor: isFlipped ? "default" : "pointer" }}
      >
        <div className="card-face card-face-front">
          <img src={default_img} />
        </div>
        <div className="card-face card-face-back">
          <img src={image} alt={name} />
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;

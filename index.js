import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const randomID = Math.round(Math.random() * 1025) + 1;
  const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${randomID}/`;
  const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${randomID}/`;

  try {
    const [pokemonResponse, speciesResponse] = await Promise.all([
      axios.get(pokemonURL),
      axios.get(speciesURL),
    ]);

    const pokemonData = pokemonResponse.data;
    const speciesData = speciesResponse.data;

    const type = pokemonData.types.map((item) => item.type.name).join(", ");
    const typeLabel = pokemonData.types.length === 1 ? "Type" : "Types";

    const abilities = pokemonData.abilities
      .map((item) => item.ability.name)
      .join(", ");

    const genderDescription = getGenderDescription(speciesData.gender_rate);

    res.render("index.ejs", {
      pokemon: pokemonData,
      type,
      typeLabel,
      abilities,
      genderDescription: genderDescription,
    });
  } catch (err) {
    console.error("Erro ao buscar dados da API:", err);
    res.status(500).send("Erro ao buscar dados do Pokémon.");
  }
});

function getGenderDescription(genderRate) {
  if (genderRate === -1) {
    return "genderless";
  } else if (genderRate === 0) {
    return "male";
  } else if (genderRate === 8) {
    return "female";
  } else {
    return "male or female";
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const pokeIdFromQuery = req.query.pokeID;
  const pokeID = pokeIdFromQuery
    ? parseInt(pokeIdFromQuery)
    : Math.floor(Math.random() * 1025) + 1;

  const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/`;
  const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${pokeID}/`;
  const locationsURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/encounters`;

  try {
    const [pokemonResponse, speciesResponse, locationsResponse] =
      await Promise.all([
        axios.get(pokemonURL),
        axios.get(speciesURL),
        axios.get(locationsURL),
      ]);

    const pokemonData = pokemonResponse.data;
    const speciesData = speciesResponse.data;
    const locationsData = locationsResponse.data;

    const type = pokemonData.types.map((item) => item.type.name).join(", ");
    const typeLabel = pokemonData.types.length === 1 ? "Type" : "Types";

    const abilities = pokemonData.abilities
      .map((item) => item.ability.name)
      .join(", ");

    const genderDescription = getGenderDescription(speciesData.gender_rate);

    const descriptionEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    const description = descriptionEntry
      ? descriptionEntry.flavor_text
      : "Description not available in English.";

    const locations = locationsData.map((item) => item.location_area.name);

    const evolutionChainURL = speciesData.evolution_chain.url;

    const evolutionChainResponse = await axios.get(evolutionChainURL);
    const evolutionChainData = evolutionChainResponse.data;

    const evolutions = await getEvolutionsWithSprites(evolutionChainData.chain);

    res.render("index.ejs", {
      pokemon: pokemonData,
      type,
      typeLabel,
      abilities,
      genderDescription,
      locations,
      description,
      evolutions,
      pokeIdFromQuery,
    });
  } catch (err) {
    console.error("Erro ao buscar dados da API:", err);
    res.status(500).send("Erro ao buscar dados do Pokémon.");
  }
});

app.get("/findPokemon", async (req, res) => {
  const pokeName = req.query.pokemonName;
  try {
    const result = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokeName}/`
    );
    const pokeID = result.data.id;
    res.redirect(`/?pokeID=${pokeID}`);
  } catch (err) {
    console.error("Erro ao buscar dados da API:", err);
    res.status(500).send("Erro ao buscar dados do Pokémon.");
  }
});

app.get("evolutionPoke", (req, res) => {
  const pokeID = req.query.pokeID;
  if (!pokeID) {
    return res.status(400).send("ID do Pokémon não fornecido.");
  }
  console.log(`Novo pokeID recebido: ${req.params.id}`);
  res.redirect("/");
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

async function getEvolutionsWithSprites(chain) {
  const evolutions = [];

  async function traverse(chain) {
    const speciesName = chain.species.name;
    const speciesUrl = chain.species.url;

    const speciesResponse = await axios.get(speciesUrl);
    const speciesID = speciesResponse.data.id;
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesID}.png`;

    evolutions.push({
      name: speciesName,
      id: speciesID,
      sprite,
    });

    for (const evolution of chain.evolves_to) {
      await traverse(evolution);
    }
  }

  await traverse(chain);
  return evolutions;
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

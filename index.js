import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

// Main Route
app.get("/", async (req, res) => {
  // Verify if the user searched for a pokemon
  const pokeIdFromQuery = req.query.pokeID;
  const pokeID = pokeIdFromQuery
    ? parseInt(pokeIdFromQuery)
    : Math.floor(Math.random() * 1025) + 1;

  // Set API URLs
  const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/`;
  const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${pokeID}/`;
  const locationsURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/encounters`;

  try {
    // Axios request
    const [pokemonResponse, speciesResponse, locationsResponse] =
      await Promise.all([
        axios.get(pokemonURL),
        axios.get(speciesURL),
        axios.get(locationsURL),
      ]);

    // Response data
    const pokemonData = pokemonResponse.data;
    const speciesData = speciesResponse.data;
    const locationsData = locationsResponse.data;

    // Pokemon type
    const type = pokemonData.types.map((item) => item.type.name).join(", ");
    const typeLabel = pokemonData.types.length === 1 ? "Type" : "Types";

    // Pokemon abilities
    const abilities = pokemonData.abilities
      .map((item) => item.ability.name)
      .join(", ");

    // Pokemon gender
    const genderDescription = getGenderDescription(speciesData.gender_rate);

    // Pokemon description
    const descriptionEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    const description = descriptionEntry
      ? descriptionEntry.flavor_text
      : "Description not available in English.";

    // Pokemon locations
    const locations = locationsData.map((item) => item.location_area.name);

    // Pokemon chain evolution
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
    res.status(500).send("Failed to fetch Pokemon data.");
  }
});

// Search pokemon route
app.get("/findPokemon", async (req, res) => {
  // Get pokemon name to retrieve its ID
  const pokeName = req.query.pokemonName.toLowerCase();
  try {
    const result = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokeName}/`
    );
    // Redirect to main route with the pokeID
    const pokeID = result.data.id;
    res.redirect(`/?pokeID=${pokeID}`);
  } catch (err) {
    res.status(404).send("Pokémon not found. Please enter a valid name.");
  }
});

// Evolutions pokemon route
app.get("evolutionPoke", (req, res) => {
  const pokeID = req.query.pokeID;
  res.redirect("/");
});

// Function to get the gender of the pokemon
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

// Function to get pokemon evolutions with their sprites
async function getEvolutionsWithSprites(chain) {
  const evolutions = [];

  // Recursive function to traverse the evolution chain
  async function traverse(chain) {
    // Extract species name and URL
    const speciesName = chain.species.name;
    const speciesUrl = chain.species.url;

    // Make a request with the new URL to get the species data
    const speciesResponse = await axios.get(speciesUrl);
    const speciesID = speciesResponse.data.id;
    // Construct the sprite URL
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesID}.png`;

    // Add the evolution data to the array
    evolutions.push({
      name: speciesName,
      id: speciesID,
      sprite,
    });

    // Recursively process the next evolutions
    for (const evolution of chain.evolves_to) {
      await traverse(evolution);
    }
  }

  await traverse(chain);
  return evolutions;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

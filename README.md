# Pokedex Project

This project is a simple web application that functions as a **Pokedex**. It fetches data from a public Pokémon API and displays information about various Pokémon. Users can search for Pokémon, view their stats, types, and other details in an intuitive and user-friendly interface.

---

## Features

- Fetch Pokémon data from a public API.
- Display Pokémon details like name, type, and stats.
- Responsive design for a seamless experience on different devices.
- Lightweight and fast, designed with simplicity in mind.

---

## Getting Started

Follow the steps below to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone [<repository-url>](https://github.com/marcossilva11/Pokefinder.git)
   ```

2. Navigate to the project directory:
   ```bash
   cd Pokefinder
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Project

To start the application, you have two options:

1. Using Node.js:
   ```bash
   node index.js
   ```
   
2. Using Nodemon (for automatic restarts on file changes):
   ```bash
   npx nodemon index.js
   ```

By default, the server will run on port `3000`.

### Accessing the Application

Once the server is running, open your browser and go to:
```
http://localhost:3000
```

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for Node.js.
- **Axios**: HTTP client for making API requests.
- **EJS**: Template engine for rendering HTML.
- **JavaScript (JS)**: Core programming language for the application.
- **HTML & CSS**: For structuring and styling the frontend.

---

## Contributing

Contributions are welcome! Feel free to fork the repository, create a feature branch, and submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing Pokémon data.
- Inspired by the Pokémon universe.

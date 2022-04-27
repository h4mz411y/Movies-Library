'use strict';


// Declrations

const express = require ('express');
const movieData = require ("./MovieData/data.json");

const app = express();
const port = 3000 ; 
app.listen  (port, handlLestin)

app.get ("/" , handleHomePage)
app.get("/favorite" , handleFavoritePage)





// functions

function handlLestin () {
    console.log(`Example app listening on port ${port}`);
}


function handleHomePage (req,res) {
    let result = [];
    let newMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    result.push(newMovie)
res.json(result);
}


function handleFavoritePage (req,res) {
res.send ("Welcome to Favorite Page");
}

app.get("/error", (req, res) => {
    res.status(500).send("Sorry, something went wrong");
  });
  
  app.get("*", (req, res) => {
    res.status(404).send("404 Page not found");
  });
  
  

function Movie (title, poster_path , overview) {
    this.title = title; 
    this.poster_path = poster_path ;
    this.overview=overview;



}

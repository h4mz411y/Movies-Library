'use strict';


// Declrations
const PORT = 3004; 
const express = require ('express');
const movieData = require ("./MovieData/data.json");
const cors = require("cors");
const bodyParser = require('body-parser');
const axios = require('axios').default;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { Client } = require('pg')
const client = new Client({
  host: "localhost",
  user: "fakhreddin",
  port : 5432,
  password: "0000",
  database: "movies"


})





 
// Routs
app.get ("/" , handleHomePage)
app.get("/favorite" , handleFavoritePage)
app.get ("/trending" , handletrending)
app.get ("/search" , handleSearch)
app.get ("/Authentication", hanleAuthentication)
app.get ("/Languages",handleLanguages)
app.post("/addMovie", handleAdd);
app.get("/getMovies", handleGet);
app.put("/update/:movieId",handleUpdate);
app.delete("/deleteMovie", handleDelete);


app.get("/error", (req, res) => {
  res.status(500).send("Sorry, something went wrong");
});

app.get("*", (req, res) => {
  res.status(404).send("404 Page not found");
});


// functions

async function startServer() {
  try {
    const connectDB = await client.connect();
    const listenNow = await app.listen(PORT, () => {
      console.log(`Example app listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
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

function handleSearch (req,res){
 
  let movieName = req.query.movieName;

  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=${movieName}&page=2`)
  .then(searchApiResult =>{
    console.log(searchApiResult.data.results);
    
    let searchMovieResult = searchApiResult.data.results.map((search)=>{

      return new Search (search.id,search.title,search.release_date,search.poster_path,search.overview);
    });
    res.json (searchMovieResult);
  })
  .catch(error=>{
    console.log(error);
  res.send(" Error");
  })

}

function handletrending (req,res) {
axios.get ("https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US")
.then(apiResult => {
  console.log(apiResult.data.results);
  let trindingMovieResult = apiResult.data.results.map((trend) => {
return new Trending (trend.id,trend.title,trend.release_date,trend.poster_path,trend.overview);
  });
  res.send(trindingMovieResult);
} )
.catch(error=> {
  console.log(error);
  res.send("Error");
  
})

}
function hanleAuthentication (req,res){
  axios.get ("https://api.themoviedb.org/3/movie/76341?api_key=37ddc7081e348bf246a42f3be2b3dfd0")
  .then(resulAuthentication => {
  
    console.log(resulAuthentication.data);
    res.json(resulAuthentication.data);
  })
  .catch()

}

function handleLanguages (req,res){
axios.get("https://api.themoviedb.org/3/movie/76341?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=de")
.then(resultLanguage => {
console.log(resultLanguage.data);
res.json(resultLanguage.data);

})

.catch()


}

function handleAdd(req, res) {


  const { id, original_title, release_date, poster_path, overview } = req.body;
  let sql = `INSERT INTO movies(id, original_title, release_date, poster_path, overview) VALUES($1, $2, $3, $4, $5)`;
  let values = [id, original_title, release_date, poster_path, overview];
  client
    .query(sql, values)
    .then((result) => {
      console.log(result);
      return res.status(201);
    })
    .catch((err) => {
      handleError(err, req, res);
    });

  res.send("Insert done");


}

function handleGet(req, res) {

  let sql = 'SELECT * from movies;'
  client.query(sql).then((result) => {
      console.log(result);
      res.json(result.rows);
  }).catch((err) => {
      handleError(err, req, res);
  });
}

function handleUpdate (req,res) {
  const { movieId } = req.params;
    const { id, original_title, release_date, poster_path, overview } = req.body;

    let sql = `UPDATE movies SET id = $1, original_title = $2, release_date = $3, poster_path = $4, overview = $5;`
    let values = [id, original_title, release_date, poster_path, overview];

    client.query(sql, values).then(result => {
      console.log(result);
      res.send("Updated successfully!");
      res.json(result.rows[0]);
  }

  ).catch();

}

function handleDelete(req, res) {
  const { movieId } = req.query
  console.log(movieId);
  let sql = 'DELETE FROM movies WHERE id = $1;'
  let value = [movieId];
  client.query(sql, value).then(result => {
      console.log(result);
      res.status(204).send("Deleted successfully!");
  }
  ).catch()
}


startServer();


  // constructors

function Movie (id,title,release_date, poster_path , overview) {
  this.id = id;  
  this.title = title;
  this.release_date = release_date; 
    this.poster_path = poster_path ;
    this.overview=overview;
}
    function Trending (id,title,release_date, poster_path , overview) {
      this.id = id;  
      this.title = title;
      this.release_date = release_date; 
     this.poster_path = poster_path ;
    this.overview=overview;

}
function Search (id,title,release_date, poster_path , overview) {
  this.id = id;  
  this.title = title;
  this.release_date = release_date; 
 this.poster_path = poster_path ;
this.overview=overview;



}





const apiKey = process.env.TMDB_KEY;
const Api_Url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=1`;

const Img_Base_Url = "https://image.tmdb.org/t/p/w500";
// const Img_Base_Url = "https://image.tmdb.org/t/p/w1280";

const Search_Api_Url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query='`;

const Search_by_Year_Api_Url =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=1&primary_release_year=";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchYearForm = document.getElementById("search-form-year");
const searchYearInput = document.getElementById("search-input-year");
const main = document.getElementById("main");
let movieList = [];

//getting movies
getMovies(Api_Url);

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  listMovies(data.results);
  movieList = data.results;
}

function getRatingColor(rating) {
  if (rating >= 8) {
    return "green";
  } else if (rating >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function listMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, release_date } = movie;
    const movieDiv = document.createElement("div");

    movieDiv.innerHTML = `
    <div class="movie">
        <img
        src="${Img_Base_Url + poster_path}"
        alt="${title}"
        loading:"lazy"
        />
        <div class="movie-info">
          <h3>${title} (${release_date})</h3>
          <span class="${getRatingColor(
            vote_average
          )}"><i class="fa fa-star" aria-hidden="true"></i> ${vote_average}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
      </div>    
    `;
    main.appendChild(movieDiv);
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = searchInput.value;
  if (searchValue && searchValue !== "") {
    getMovies(Search_Api_Url + searchValue);
    searchInput.value = "";
  } else {
    window.location.reload();
  }
});

searchYearForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const year = searchYearInput.value;

  if (year && year !== "") {
    getMovies(Search_by_Year_Api_Url + year);
    searchYearInput.value = "";
  } else {
    window.location.reload();
  }
});

function filterList(mode) {
  switch (mode) {
    case "date-asc":
      movieList.sort((a, b) => {
        return new Date(a.release_date) - new Date(b.release_date);
      });
      break;
    case "date-desc":
      movieList.sort((a, b) => {
        return new Date(b.release_date) - new Date(a.release_date);
      });
      break;
    case "name-asc":
      movieList.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });

      break;
    case "name-desc":
      movieList.sort((a, b) => {
        return b.title.localeCompare(a.title);
      });
      break;
  }
  listMovies(movieList);
}

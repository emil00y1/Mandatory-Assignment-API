const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZTE0YTE5Mzk5YTFkYmUwMTFhZWI5ZjA2NGVmZTQ1ZCIsIm5iZiI6MTcyNzA3MzIzNi40NTg3MzMsInN1YiI6IjY2ZjEwYTgwNzMwMGE1YmEyMTNiNzliYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wG6fznCLOsxq9wpYIkyqRrjijJ0Xl3XR9jdXhCZPajA",
  },
};

const currentUrl = window.location.pathname;
const moviesList = document.querySelector("#movies_list");
let currentPage = 1;

let endpoint = "";

if (currentUrl.includes("popular.html")) {
  endpoint = "/popular";
} else if (currentUrl.includes("top-rated.html")) {
  endpoint = "/top_rated";
} else if (currentUrl.includes("upcoming.html")) {
  endpoint = "/upcoming";
} else {
  endpoint = "/now_playing";
}
fetchMovies();

function fetchMovies() {
  let fetchUrl =
    "https://api.themoviedb.org/3/movie" +
    endpoint +
    "?language=en-US&page=" +
    currentPage;
  console.log(fetchUrl);
  fetch(fetchUrl, options)
    .then((response) => response.json())
    .then((data) => {
      showMovies(data);
    })
    .catch((err) => console.error(err));
}

function showMovies(data) {
  document.querySelector(".total_results").textContent =
    data.total_results + " total results";
  document.querySelector(".current_page").textContent = "Page " + currentPage;
  data.results.forEach((movie) => {
    const template = document.querySelector("#movie_template").content;
    const copy = template.cloneNode(true);

    copy.querySelector("h2").textContent = movie.title;
    copy.querySelector("img").src =
      "https://image.tmdb.org/t/p/w500/" + movie.poster_path;

    copy.querySelector("img").alt = "Movie poster for " + movie.title;

    if (window.innerWidth < 768) {
      const overview =
        movie.overview.length > 400
          ? movie.overview.substring(0, 400) + "..."
          : movie.overview;
      copy.querySelector(".overview").textContent = overview;
    } else {
      copy.querySelector(".overview").textContent = movie.overview;
    }

    copy.querySelector(".og_title").innerHTML =
      " <span class='emph_text'>Original title: </span>" + movie.original_title;

    copy.querySelector(".release").innerHTML =
      "<span class='emph_text'>Release date: </span>" + movie.release_date;

    document.querySelector("#movies_list").appendChild(copy);
  });
}

document.querySelector(".next_page").addEventListener("click", nextPage);
document.querySelector(".prev_page").addEventListener("click", prevPage);

function nextPage() {
  currentPage += 1;
  moviesList.innerHTML = "";
  fetchMovies();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage += -1;
  } else {
    currentPage = 1;
  }
  moviesList.innerHTML = "";
  fetchMovies();
}

// CREATE PAGINATION PAGES

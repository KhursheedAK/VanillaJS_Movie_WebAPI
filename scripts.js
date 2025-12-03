import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM is fully loaded and parsed.');

  const movieInput = document.getElementById('movie-search-input');
  const btnSearch = document.querySelector('.btn-search');
  const movieFilterInput = document.getElementById('movie-filter-input');
  const url = 'https://imdb.iamidiotareyoutoo.com/search?q=';

  const movieGrid = document.querySelector('.movie-grid');

  // Pagination variables
  let currentPage = 1;
  const itemsPerPage = 3;

  // Movie data
  let fullMovieList = []; // Full API results
  let currentMovieList = []; // Filtered results

  // Render movies with pagination
  const renderMovies = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const moviesToRender = currentMovieList.slice(startIndex, endIndex);

    if (!moviesToRender || moviesToRender.length === 0) {
      movieGrid.innerHTML = '<h1>No Results Found.</h1>';
      updatePagination();
      return;
    }

    const movieHTML = moviesToRender
      .map((film) => {
        return `
        <div class="movie-item">
          <img src="${film['#IMG_POSTER']}" alt="film-poster"/>
          <h1>${film['#TITLE']}</h1>
          <p>${film['#YEAR']}</p>
          <p>RANK: ${film['#RANK']}</p>
        </div>`;
      })
      .join('');

    movieGrid.innerHTML = movieHTML;
    updatePagination();
  };

  // Update page buttons + info
  function updatePagination() {
    const totalPages = Math.ceil(currentMovieList.length / itemsPerPage);

    document.getElementById(
      'page-info',
    ).textContent = `Page ${currentPage} of ${totalPages}`;

    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
  }

  // --- SEARCH MOVIES (Button Click) ---
  const displayMovies = () => {
    btnSearch.addEventListener('click', () => {
      const movie = movieInput.value.trim();
      if (!movie) {
        alert('Please input movie name..');
        return;
      }

      movieGrid.innerHTML = '<h1>Loading Movies...</h1>';

      axios.get(`${url}${movie}`).then((res) => {
        fullMovieList = res.data.description;
        currentMovieList = [...fullMovieList];

        currentPage = 1;
        renderMovies();
      });
    });
  };

  // --- SEARCH MOVIES (Enter Key) ---
  const displayMoviesOnEnter = () => {
    movieInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        const movie = movieInput.value.trim();
        if (!movie) {
          alert('Please input movie name..');
          return;
        }

        movieGrid.innerHTML = '<h1 class="loading-text">Loading Movies...</h1>';

        axios.get(`${url}${movie}`).then((res) => {
          fullMovieList = res.data.description;
          currentMovieList = [...fullMovieList];

          currentPage = 1;
          renderMovies();
        });
      }
    });
  };

  // --- FILTER MOVIES ---
  const filterMoviesOnKeyPress = () => {
    movieFilterInput.addEventListener('keyup', () => {
      const query = movieFilterInput.value.trim().toLowerCase();

      currentMovieList = fullMovieList.filter((movie) =>
        movie['#TITLE'].trim().toLowerCase().includes(query),
      );

      currentPage = 1; // Reset page when filtering
      renderMovies();
    });
  };

  // --- PAGINATION BUTTONS ---
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderMovies();
    }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(currentMovieList.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderMovies();
    }
  });

  displayMovies();
  displayMoviesOnEnter();
  filterMoviesOnKeyPress();
});

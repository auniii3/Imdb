let favListSelf;
var favListDOM = document.getElementById('fav-list');
var searchedMovieDiv = document.getElementById('searched-movie-div');
var movDiv = document.getElementById('movie-div');
class FavMovieList {
    constructor() {
        this.movieList = localStorage.getItem('favList');
        favListSelf = this;
        this.renderFavMovieList();
    }

    renderFavMovieList() {
        searchedMovieDiv.style.display = 'none';
        movDiv.innerHTML = '';
        favListDOM.innerHTML = '';
        let list = JSON.parse(this.movieList);
        list.forEach(mov => {
            favListSelf.addToDOM(mov);
        });
        return;
    }

    addToDOM(movie) {
        let dom = $(`<li class = "movie">
                            <div class = 'movie-list-container'>
                                <div class = "title-div">
                                    <a href = "#" id=${movie.id} class="movie-title">
                                    ${movie.title}</a>
                                </div>
                                <img src= ${movie.poster} class='movie-poster' 
                                alt='N/A for ${movie.title}' height='120px' width='130px'>
                                <i title="Remove from favourites" class="fa-solid fa-minus addfav-related" 
                                data-title="${movie.title}" data-id="${movie.id}" data-poster="${movie.poster}" ></i>
                            </div>
                        </li>`);
        $('#fav-list').append(dom);
        return;
    }
}
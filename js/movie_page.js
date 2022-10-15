let moviePageSelf;
var searchedMovieDiv = document.getElementById('searched-movie-div');
var favDiv = document.getElementById('fav-list');

//class for getting single movie details
class MoviePage {
    constructor(movieId) {
        this.movieId = movieId;
        this.apikey = '50047b81';
        moviePageSelf = this;
        this.getMovieDetails();
    }

    getMovieDetails() {
        searchedMovieDiv.style.display = 'none';
        favDiv.innerHTML = '';
        $.ajax({
            type: 'GET',
            url: 'https://www.omdbapi.com/',
            data: `i=${this.movieId}&plot=full&apikey=${this.apikey}&type=movie`,
            success: function (data) {
                if (data.Response == "True") {
                    moviePageSelf.renderMovie(data);
                }
                else if (data.Response == "False") {
                    alert('No such movie exists. Please provide valid movie title.');
                    return;
                }
            }
        })


    }
    //rendering movie dom page
    renderMovie(moviedata) {
        if (moviedata.Poster == "N/A") {
            moviedata.Poster = "https://d1nhio0ox7pgb.cloudfront.net/_img/v_collection_png/512x512/shadow/movie.png";
        }
        if (moviedata.Plot == "N/A") {
            moviedata.Plot = "No description available.";
        }
        var mov = $(`
                    <div class="movie-page-poster">
                        <h1>${moviedata.Title}</h1>
                        <img src= ${moviedata.Poster} class="movie-image"
                        alt='No movie poster for ${moviedata.Title}' height='250px' width='250px'>
                    </div> 
                    <h5>Description:</h5>
                    <p class='movie-plot'>${moviedata.Plot}</p> 
                    <div id='more-details'>
                        <p class='rating'><strong>Imdb Rating: </strong> ${moviedata.imdbRating}</p> 
                        <p class = 'runtime'><strong>Runtime:</strong> ${moviedata.Runtime}</p>
                        <p class = 'languages'><strong>Languages:</strong> ${moviedata.Language}</p>
                        <p class = 'release'><strong>Released On:</strong> ${moviedata.Released}</p> 
                    </div>
                `)
        $("#movie-div").append(mov);
        return;
    }


}


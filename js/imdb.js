(function () {
    var apikey = '50047b81';
    var movName;
    var favMovList = [];
    favMovList.push.apply(favMovList, JSON.parse(localStorage.getItem('favList')));

    var movieList = [
        "Dhoom",
        "Dhoom 2",
        "Dhoom 3",
        "Matrix",
        'Twilight',
        "Inception"
    ];

    var movieDOM = document.getElementById('movie-name');
    var movieListDOM = document.getElementById('movie-list');
    var searchedMovieDiv = document.getElementById('searched-movie-div');
    var movDiv = document.getElementById('movie-div');
    var favMovDiv = document.getElementById('fav-list');
    var singleMovie = document.getElementById('single-movie');


    movieDOM.addEventListener('keyup', autoComplete);

    function getMovie() {
        movieListDOM.innerHTML = '';
        singleMovie.innerHTML = '';
        $.ajax({
            type: 'GET',
            url: 'https://www.omdbapi.com',
            data: `t=${movName}&plot=full&apikey=${apikey}&type=movie`,
            success: function (data) {
                if (data.Response == "True") {
                    addMovieDOM(data);
                }
                else if (data.Response == "False") {
                    alert('No such movie exists. Please provide valid movie title.');
                    return;
                }
            }
        });
        getMovieDetails();
        return;
    }

    function getMovieDetails() {
        $.ajax({
            type: 'GET',
            url: 'https://www.omdbapi.com',
            data: `s=${movName}&plot=full&apikey=${apikey}&type=movie`,
            success: function (data) {
                if (data.Response == "True") {
                    renderMovieList(data.Search);
                }
            }
        });
        return;
    }

    //
    function renderMovieList(movieData) {
        let header = $(`<h6>Other related movies:</h6>`);
        $('#movie-list').append(header);
        movieData.forEach(movie => {
            if (movName.toLowerCase() != movie.Title.toLowerCase()) {
                addRelatedMovieDOM(movie);
            }
        });
        return;
    }

    //adding dom for searched movie
    function addMovieDOM(movie) {
        if (!movie.Poster) {
            movie.Poster = "https://d1nhio0ox7pgb.cloudfront.net/_img/v_collection_png/512x512/shadow/movie.png";
        }
        singleMovie.innerHTML = '';
        let liDOM = $(`<li class = "movie single-movie">
                    <div class = 'movie-list-container'>
                        <div class = "title-div">
                            <a href = "#" id=${movie.imdbID} class="movie-title single-movie-title">
                            ${movie.Title}</a>
                        </div>
                        <div class="poster-fav">
                        <img src= ${movie.Poster} class='movie-poster' data-id="${movie.imdbID}"
                            alt='N/A for ${movie.Title}' height='150px' width='150px'> 
                            
                            <i title="Add To favourites" 
                            class="fa-regular fa-heart addfav" data-title="${movie.Title}" data-id="${movie.imdbID}"
                                        data-poster="${movie.Poster}"></i>
                        </div>
                    </div>
                    </li>`);
        $('#single-movie').append(liDOM);
        return;
    }

    //adding dom for related movies
    function addRelatedMovieDOM(movie) {
        //if movie poster is not available
        if (movie.Poster == "N/A") {
            movie.Poster = "https://d1nhio0ox7pgb.cloudfront.net/_img/v_collection_png/512x512/shadow/movie.png";
        }
        let liDOM = $(`<li class = "movie">
                        <div class = 'movie-list-container'>
                            <div class = "title-div">
                                <a href = "#" id=${movie.imdbID} class="movie-title">
                                ${movie.Title}</a>
                            </div>
                            <img src= ${movie.Poster} class='movie-poster' 
                            alt='N/A for ${movie.Title}' height='120px' width='130px'>
                            <i title="Add To favourites" 
                            class="fa-regular fa-heart addfav-related" data-title="${movie.Title}" data-id="${movie.imdbID}"
                                        data-poster="${movie.Poster}"></i>
                        </div>
                    </li>`);
        $('#movie-list').append(liDOM);
        return;
    }

    //adding movieimdb id,title and poster in fav list
    function addToFav(movieId, movieTitle, poster) {
        let favMovJson = {};
        if (favMovList.filter(x => x.id == movieId).length > 0) {
            showNotification('Already added to favourites.');
            return;
        }
        favMovJson.id = movieId;
        favMovJson.title = movieTitle;
        favMovJson.poster = poster;
        favMovList.push(favMovJson);
        showNotification('Movie added to favourites.');
        localStorage.setItem('favList', JSON.stringify(favMovList));
        return;
    }

    //removing from favlist
    function removeFromFav(movieId) {
        let favouriteList = JSON.parse(localStorage.getItem('favList'));
        favMovList = favouriteList.filter(x => x.id != movieId);
        localStorage.setItem('favList', JSON.stringify(favMovList));
        showNotification('Movie removed from favourites.');
        new FavMovieList();
        return;
    }

    //for showing alert messages
    function showNotification(message) {
        alert(message);
    }

    //handling all click listener
    function handleClickListener(event) {
       
        event.preventDefault();
        let target = event.target;
        let classSplit = $(target).attr("class").split(' ');
    
        if (target.id == 'movie-search') {
            movName = movieDOM.value;
            if (!movName) {
                alert("Movie name cannot be empty");
                return;
            }
            movDiv.innerHTML = '';
            favMovDiv.innerHTML = '';
            movieDOM.value = '';
            searchedMovieDiv.style.display = 'block';
            getMovie();
            return;
        }
        else if (classSplit[0] == 'movie-title') {
            new MoviePage(target.id);
            return;
        }
        else if (classSplit[0] == 'movie-poster') {
            let movieId = $(target).attr('data-id');
            new MoviePage(movieId);
            return;
        }

        else if (target.id == 'home') {
            movDiv.innerHTML = '';
            favMovDiv.innerHTML = '';
            searchedMovieDiv.style.display = 'block';
            return;
        }
        else if (classSplit[0] == 'fa-regular') {
            let movieId = $(target).attr('data-id');
            let movieTitle = $(target).attr('data-title');
            let moviePoster = $(target).attr('data-poster');
            addToFav(movieId, movieTitle, moviePoster);
            return;
        }

        else if (target.id == 'fav-link') {
            if (favMovList.length == 0) {
                showNotification('No movie added to favourites.');
                return;
            }
            new FavMovieList();
            return;
        }
        else if (classSplit[0] == 'fa-solid') {
            let id = ($(target).attr("data-id"));
            removeFromFav(id);


        }
        return;
    }

    //providing suggestions while typing
    function autoComplete() {
        $("#movie-name").autocomplete({
            minLength: 2,
            delay: 100,
            autoFocus: true,
            source: movieList

        })
    }

    //to initialize the app
    function initialiseApp() {
        document.addEventListener('click', handleClickListener);
    }

    initialiseApp();

})()

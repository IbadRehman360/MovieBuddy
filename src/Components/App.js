import { useEffect, useState } from "react";
import StarRating from './StarRating'

const api_key = '231d2b1a'

const average = (arr) =>
    arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
// http://www.omdbapi.com/?apikey=[yourkey]&

export default function App() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imdbID, setimdbIb] = useState("")

    const HoverImbdId = (id) => {
        setimdbIb((selectedId => (selectedId === id) ? null : id))
    }
    const onCloseButton = () => {
        setimdbIb(null);
    }

    const handleAddWatched = (movie) => {
        setWatched((watched) => [...watched, movie])
        setimdbIb(null);

    }
    const deleteWatchedMovie = (id) => {
        setWatched(watched => watched.filter(watch => watch.imdbID !== id))
    }


    useEffect(() => {
        const controller = new AbortController();
        async function fetchListOfMovies() {

            try {
                setLoading(true);
                const response = await fetch(
                    `http://www.omdbapi.com/?apikey=${api_key}&s=${query}`,
                    { signal: controller.signal }

                );

                if (!response.ok) {
                    throw new Error('Something went wrong with fetching data from the API');
                }
                const data = await response.json();

                if (data.Response === 'False') {
                    setError('No movies found');
                } else {
                    setMovies(data.Search);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.log(err.message);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }
        if (query.length < 3) {
            setMovies([])
            setError("")
            return;
        }
        onCloseButton()
        fetchListOfMovies();

        return function () {
            controller.abort();
        };
    }, [query]);

    return (
        <>
            <Nav>
                <Result query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </Nav>
            <main className="main">
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && <MovieList movies={movies} onHoverImbdId={HoverImbdId} />}
                    {error && <Error onError={error} />}
                </Box>
                <Box>
                    {imdbID ? <Movie movieId={imdbID} onCloseMovie={onCloseButton} onhandleAddWatched={handleAddWatched} /> :
                        <>
                            <WatchedSummary watched={watched} />
                            <ListOfWatchMovies watched={watched} onClickDeleteWatchMovie={deleteWatchedMovie} />
                        </>
                    }
                </Box>
            </main >
        </>
    );
}
function Error({ onError }) {
    return <p className="error">
        <span>🔴</span> {onError}
    </p>
}

function Loader() {
    return <p className="loader">
        Loading...
    </p>
}
function Nav({ children }) {
    return (
        <nav className="nav-bar">
            <div className="logo">
                <span role="img">🍿</span>
                <h1> MovieBuddy </h1>
            </div>
            {children}
        </nav>
    );
}

function Result({ query, setQuery }) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}

function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}


function Movie({ movieId, onCloseMovie, onhandleAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [userRating, setUserRating] = useState("")
    const isWatched = Array.isArray(watched) && watched.map((movie) => movie.imdbID).includes(movieId);
    const watchedUserRating = Array.isArray(watched) && watched.find(
        (movie) => movie.imdbID === movieId
    )?.userRating;
    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;
    function handleAdd() {
        const newWatchedMovie = {
            imdbID: movieId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ")[0]),
            userRating,
        };
        onhandleAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(
        function () {
            function callback(e) {
                if (e.code === "Escape") {
                    onCloseMovie();
                    console.log("sorry")
                }
            }

            document.addEventListener("keydown", callback);

            return function () {
                document.removeEventListener("keydown", callback);
            };
        },
        [onCloseMovie]
    );
    useEffect(() => {
        async function fetchMovieDetails() {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://www.omdbapi.com/?apikey=${api_key}&i=${movieId}`
                );
                const data = await response.json();
                setMovie(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMovieDetails();
    }, [movieId]);
    useEffect(() => {

        if (!title) return
        document.title = `Movie | ${title}`
        return function () {
            document.title = "MovieBuddy"
        }
    }, [title])

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>

                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${title} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating maxRating="10" size="26" onSetRating={setUserRating} />
                                    {userRating > 0 && (

                                        <button className="btn-add" onClick={handleAdd}>+ Add to list </button>
                                    )}

                                </>) : (
                                <p>
                                    You rated with movie {watchedUserRating} <span>⭐️</span>
                                </p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}

function MovieList({ movies, onHoverImbdId }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <DisplayListOfMovies movie={movie} key={movie.imdbID} onHoverImbdId={onHoverImbdId} />
            ))}
        </ul>
    );
}

function DisplayListOfMovies({ movie, onHoverImbdId }) {
    return (
        <li key={movie.imdbID} onClick={() => onHoverImbdId(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}


function ListOfWatchMovies({ watched, onClickDeleteWatchMovie }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <DisplayListOFWatchedMovies movie={movie} key={movie.imdbID} onClickDelete={onClickDeleteWatchMovie} />
            ))}
        </ul>
    );
}
function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}
function DisplayListOFWatchedMovies({ movie, onClickDelete }) {
    return (
        <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.Title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <button className="btn-delete" onClick={() => onClickDelete(movie.imdbID)}>
                    ❌
                </button>
            </div>
        </li>
    );
}
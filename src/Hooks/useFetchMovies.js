import { useState, useEffect } from "react";
const api_key = '231d2b1a'

export function useFetchMovies(query, onCloseAction) {
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);

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
        onCloseAction()
        fetchListOfMovies();

        return function () {
            controller.abort();
        };
    }, [query]);
    return [movies, isLoading, error]
}
import React from "react";
// { useState } 
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Components/App";
// import StarRating from "./Components/StarRating";


// function Test() {
//     const [movieRating, setMovieRating] = useState(0);

//     function handleSetRating(rating) {
//         setMovieRating(rating);
//     }

//     return (
//         <div>
//             <StarRating color="blue" maxRating={10} onSetRating={handleSetRating} />
//             <p> your movie was rated {movieRating} starStyle </p>
//         </div>
//     );
// }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
        {/* <StarRating maxRating={5} messages={["terrible", "bad", "Okey", "good", "Amazing"]} /> */}
        {/* <StarRating defaultRating={2} size={24} color="red" className="test" /> */}
        {/* <Test /> */}
    </React.StrictMode>
);

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import loader from "../../img/poke.png";
import { Card } from "../";

import "./Main.css";

const Main = () => {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20" // Url-da "&" belgisi qo'shildi
  );
  const [nextPage, setNextPage] = useState("");
  const [prevPage, setPrevPage] = useState("");

  const getData = useCallback(async () => { // useCallback orqali getData funksiyasi yaratildi
    setIsLoading(true);
    try {
      const data = await axios.get(url).then((res) => res.data);

      setNextPage(data.next);
      setPrevPage(data.previous);

      const pokemonsData = await Promise.all(
        data.results.map(async (item) => {
          const response = await axios.get(item.url);

          return response.data;
        })
      );

      setPokemons(pokemonsData);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    getData();
  }, [getData]); // getData qo'shildi

  return (
    <>
      <main>
        <div className="container mb-5">
          {isLoading ? (
            <img src={loader} alt="loader" className="loader" />
          ) : (
            <>
              <div className="row row-col-4 gap-3">
                {pokemons.map((pokemon, idx) => {
                  return (
                    <Card
                      name={pokemon.name}
                      key={idx}
                      img={pokemon.sprites.other.dream_world.front_default}
                      types={pokemon.types}
                      id={pokemon.id}
                    />
                  );
                })}
              </div>
              <div className="pages">
                <button className="btn btn-success mx-5 fs-5" onClick={() => setUrl(prevPage)}>prev</button>
                <button className="btn btn-success mx-5 fs-5" onClick={() => setUrl(nextPage)}>next</button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Main;

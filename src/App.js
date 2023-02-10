import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './App.css';


const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};


function App() {
  const API_URL = 'https://api.themoviedb.org/3';
  const API_KEY = 'ddf17c3a5b653c45486fa621d3dc3b91';
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original';
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original';

  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState('')
  const [trailer, setTrailer] = useState()
  const [movie, setMovie] = useState({ title: 'Loading Movies'})
  const [playing, setPlaying] = useState(false)

  const fetchMovies = async(searchKey) =>{
    const type = searchKey ? 'search' : 'discover'
    const { data: { results },} = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey
      }
    })
    setMovies(results)
    setMovie(results[0])
    if(results.length){
      await fetchMovie(results[0].id)
    }
  }

  const selectMovie = async(movie) => {
    console.log('movie', movie)
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0,0)
  }

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey)
  } 

  const fetchMovie = async(id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'videos'
      }
    })

    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(vid => vid.name === 'Official Trailer')
      setTrailer(trailer ? trailer : data.videos.results[0] )
    }
    setMovie(data)
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <>
    <header className='header'>
      <div className="container d-flex justify-content-between align-items-center">
          <div className='left'>
              <h1 className="title-header">Big Comback</h1>
              <p className="description-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quae ipsam odit quod quidem id inventore unde itaque, reiciendis excepturi..</p>

              <button onClick={() => setPlaying(true)} className="btn-style btn btn-primary">WATCH NOW</button>
              <button className="btn-style btn btn-outline-secondary">+PLAYLIST</button>
          </div>
          <div>
            <section>
              {
                movie ? ( 
                  <div className='viewtrailer' style={{backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`}}
                  >
                    {
                      playing? (
                        <>
                          <YouTube 
                            videoId={trailer.key}
                            className='reproductor container'
                            containerClassName={'youtube-container amru'}
                            opts={{
                              width: '100%',
                              height: '100%',
                              playerVars: {
                                autoplay: 1,
                                controls: 0,
                                cc_load_policy: 0,
                                fs: 0, 
                                iv_load_policy: 0,
                                modestbranding: 0,
                                rel: 0,
                                showinfo: 0
                              }
                            }}
                          />
                          <button onClick={() => setPlaying(false)} className='btn-style btn btn-dark'>
                            Cerrar
                          </button>
                        </>
                      ) : (
                        <div className=''>
                          <div>
                            { 
                              trailer ? (
                                <button onClick={() => setPlaying(true)} className='btn-style btn btn-dark'> 
                                  Play
                                </button>
                              ) : (
                                'No hay trailer disponible'
                              )
                            }
                          </div>
                        </div>
                      )
                    }
                  </div>
                ) : null
              }
            </section>
          </div>
      </div>
    </header>
    <main>
        <div className="container">
          <nav className="navbar navbar-expand-lg mb-4 ">
              <ul className="navbar-nav">
                  <li className="nav-item">Today</li>
                  <li className="nav-item">This week</li>
                  <li className="nav-item">last 30 days</li>
              </ul>
          </nav>
          <form className=' mb-4' onSubmit={searchMovies}>
            <input type='text' placeholder='Buscar' onChange={(e) => setSearchKey(e.target.value)} className="input-search"
            />
            <button className='btn-style btn btn-primary'>Buscar</button>
          </form>
          <div className='carucel'>
          <Carousel className='carucel-left' responsive={responsive}>
            {
              movies?.map((movie) => (
              <div 
                  key={movie.id} 
                  className="card-movies" 
                  onClick={() => selectMovie(movie)}
                  >
                <img src={`${URL_IMAGE + movie.poster_path}`} 
                  alt='Img' 
                  className='image'
                />
                <p className='year-image'>{movie.release_date}</p>
                <h4 className='title-image'>{movie.title}</h4>
              </div> 
            ))    
            }
          </Carousel>
            <div className="carucel-rigth">
                <h2 className="title-carucel-rigth"> Action & <br /> Drama Movies</h2>
                <p className="view">view all</p>
            </div>
          </div>

  
        </div>
    </main>
    </>
  );
}

export default App;

import React, { useRef, useState, useEffect } from "react";
import CardCommunaute from './CardCommunaute';
import MenuBrief from './MenuBrief';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownShortWide, faArrowUpShortWide, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
//import handleLikeLike from "../modules/handleLike";

export default function CommunauteCreations() {

  //State variables to hold user selections
  const [valueNotation, setValueNotation] = useState(null);  // Holds rating value
  const [creations, setCreations] = useState([]);  // Holds list of creations fetched from server
  const [username, setusername] = useState("");  // Holds username input from user

  //State variables for filter params
  const [selectedProjectType, setSelectedProjectType] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const [selectedStyleType, setSelectedStyleType] = useState(null);

  useEffect(() => {
    search();
  }, []);


  const sortCreations = (value) => {
    setCreations(prevCreations => {
      if (!prevCreations) {
        return prevCreations
      }
      else {
        let sortedCreations = [...prevCreations];

        if (value === "croissant") {
          sortedCreations.sort((a, b) => (a.like?.length || 0) - (b.like?.length || 0));
        } else if (value === "decroissant") {
          sortedCreations.sort((a, b) => (b.like?.length || 0) - (a.like?.length || 0));
        }

        return sortedCreations;
      }
    });
  }

  // updates state when the notation input changes
  const onChangeNotation = (e) => {
    const value = e.target.value
    setValueNotation(value)
    //console.log(value)
    sortCreations(value)
  };


  // fetch creations from server based on filters and/or username
  const search = async () => {
    let url = '';
    if (username) {
      url = `https://brief-creativ-backend.vercel.app/briefs/user/search/${username}`;
      //console.log(url)
    } else {
      url = 'https://brief-creativ-backend.vercel.app/briefs/creationsWParams';
    }
    ;
    const params = {
      projectType: selectedProjectType,
      entrepriseType: selectedBusinessType,
      styleType: selectedStyleType,
    };

    let query = Object.keys(params)
      .filter(key => params[key] !== null)
      .map(key => `${key}=${params[key].toLowerCase()}`)
      .join("&");

    if (query) {
      url = `${url}?${query}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      if (username) {
        getCreationsForUser(data._id);
      } else {
        setCreations(data.creations);
        sortCreations(valueNotation)
      }
      //console.log(data)
    } catch (err) {
      console.error(err.message);
    }
  };

  // fetch creations from server for a specific user ID
  const getCreationsForUser = async (userId) => {
    const url = `https://brief-creativ-backend.vercel.app/briefs/user/${userId}/creations`;

    const params = new URLSearchParams({
      projectType: selectedProjectType,
      entrepriseType: selectedBusinessType,
      styleType: selectedStyleType,
    });

    url = url + '?' + params.toString();

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      setCreations(data.creations);
      sortCreations(valueNotation)
    } catch (err) {
      console.error(err.message);
    }
  };

  // update state when input changes

  const handleUsernameChange = (e) => {
    setusername(e.target.value);
    console.log('username: ', e.target.value)
  };

  const handleProjectTypeChange = (value) => {
    setSelectedProjectType(value);
    console.log("selected projectType: ", value)
  };

  const handleBusinessTypeChange = (value) => {
    setSelectedBusinessType(value);
    console.log("selected businessType: ", value)
  };

  const handleStyleTypeChange = (value) => {
    setSelectedStyleType(value);
    console.log("selected styleType: ", value)
  };

  const user = useSelector((state) => state.users.value);
  //console.log(user)
  //console.log(user._id)

  /*
  //Fetch server patch route to handle likes on creations
  const handleLike = async (creationId) => {
    const newLikes = await handleLikeLike(creationId, creations, user.token);
    console.log("New Créat",newLikes);
    if(newLikes.retour) {
      setCreations([...creations, newLikes.creations]);
    } 
    //setCreations(prevCreations => { handleLikeLike(creationId, creations)});
  }
  */

  //Fetch server patch route to handle likes on creations
  const handleLike = async (creationId) => {
    try {
      const response = await fetch(`https://brief-creativ-backend.vercel.app/briefs/creationsLikes/${creationId}/like`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": user.token
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des likes');
      }

      const data = await response.json();

      setCreations(prevCreations => {
        return prevCreations.map(creation => {
          if (creation._id === creationId) {
            return {
              ...creation,
              like: data.likes
            };
          }
          return creation;
        });
      });

      //console.log('data like:', data.likes)

    } catch (err) {
      console.error(err.message);
    }
  };


  //  Maps through creations state and creates a list of CardCommunaute components
  let cards = [];

  // const ListeCreation= () => {

  if (Array.isArray(creations) && creations.length > 0) {
    const publicCreations = creations.filter(creation => !creation.private);

    cards = publicCreations.map((creation, i) => {
      //creations are not displayed if private
      if (creation.private) {
        return null;
      }
      console.log("Créas like", creation.like)
      //console.log("usId",user._id)
      // console.log('le user id:', user._id)
      // console.log('les likes des creations :', creation.like ? creation.like : null)
      // console.log(creation)
      if (creation && creation.autor && creation.brief_id) {
        return (
          <CardCommunaute
            key={i}
            img={creation.images}
            autor={creation.autor.username}
            projectType={creation.brief_id.projectType}
            styleType={creation.brief_id.styleType}
            entrepriseType={creation.brief_id.entrepriseType}
            brief={creation.brief_id}
            likeNumber={creation.like?.length}
            onLike={() => handleLike(creation._id)}
            creationId={creation._id}
            liked={creation.like.includes(user._id)}
          />
        );
      } else {
        return null;
      }
    });
  }/*
  }

  ListeCreation();
  */

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-darkblue text-5xl mb-20 mt-20 font-montserrat font-extrabold">Créations de la Communauté</h1>

      <div className="flex flex-col lg:flex-row lg:justify-around justify-center mx-5">
        <div className="-mt-5 lg:w-1/3">
          <div className="collapse mb-5 collapse-arrow outline outline-offset-1 outline-1 outline-lightblue/40 rounded-lg">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-lightblue rounded-t-lg flex flex-row justify-between items-center">
              Notation
            </div>
            <div className="collapse-content text-black peer-checked:bg-white p-0">
              <ul>
                <li>
                  <label className="label cursor-pointer flex-none justify-start">
                    <input type="radio" name="tpstyl" className="radio radio-accent peer/tpstyl radio-sm" value="croissant"
                      onChange={onChangeNotation} />
                    <span className="label-text peer-checked/tpstyl:text-lightblue">
                      <FontAwesomeIcon icon={faArrowDownShortWide} size="xs" className="px-2 text-xl md:text-xs" /> Croissant
                    </span>
                  </label>
                </li>
                <li>
                  <label className="label cursor-pointer flex-none justify-start">
                    <input type="radio" name="tpstyl" className="radio radio-accent peer/tpstyl radio-sm" value="decroissant"
                      onChange={onChangeNotation} />
                    <span className="label-text peer-checked/tpstyl:text-lightblue">
                      <FontAwesomeIcon icon={faArrowUpShortWide} size="xs" className="px-2 text-xl md:text-xs" /> Décroissant
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <MenuBrief onProjectTypeChange={handleProjectTypeChange}
            onBusinessTypeChange={handleBusinessTypeChange}
            onStyleTypeChange={handleStyleTypeChange} />

          <div className="collapse mb-5 collapse-arrow">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-lightblue rounded-t-lg flex flex-row justify-between items-center">
              Par auteur
            </div>
            <div className="collapse-content text-black peer-checked:bg-white p-0 mt-1">
              <ul>
                <li>
                  <label>
                    <input value={username} onChange={handleUsernameChange} type="text"
                      placeholder="Auteur" class="input input-bordered input-md w-full max-w-xs" />
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <button className="py-2 px-4 w-48 mb-10 text-base rounded-lg bg-lightblue text-white md:text-xl lg:text-md focus:bg-lightblue active:bg-darkblue hover:bg-darkblue"
            onClick={() => search()}>
            <FontAwesomeIcon icon={faSearch} className="text-xl pr-3" />
            Rechercher
          </button>
        </div>
        <div className="flex flex-wrap justify-center items-center place-content-start lg:w-2/3 md:-mt-5">
          {cards.length > 0 ? cards : <p>Aucune création n'a été trouvée.</p>}
        </div>

      </div>
    </div>
  )
}
import React, { useEffect, useState } from "react";
import CardCommunaute from "./CardCommunaute";
import "react-responsive-carousel/lib/styles/carousel.css";
//import handleLikeLike from "../modules/handleLike";
import { useSelector } from "react-redux";

function CarouselHome() {
  const [ listeCreations, setListeCreations] = useState("");
  const user = useSelector((state)=> state.users.value);
  // fetch des creations limit 4
  useEffect(() => {
    const urlBackEnd = "https://brief-creativ-backend.vercel.app";
   // let limit = 4 // pb back ne limit pas
   // fetch(urlBackEnd+'/briefs/caroussel/?limit='+limit)
    fetch(urlBackEnd+'/briefs/caroussel/')
    .then(response => response.json())
    .then(crea => {
        if(crea.result) {
          const testCardData = crea.creations

          setListeCreations(testCardData);
        } else { }
      })
  }, []);
  /*
//Fetch server patch route to handle likes on creations
const handleLike = async (creationId) => {
  const newCreations = await handleLikeLike(creationId, listeCreations, user.token);

  if(newCreations) {
    setListeCreations([...listeCreations, newCreations]);
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

        setListeCreations(prevCreations => {
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

  

    } catch (err) {
        console.error(err.message);
    }
};


let cards=""
if(listeCreations=="") {
  cards = 
  <div className='bg-whitepink/40 text-darkblue mb-20 p-10 rounded-3xl mx-10 text-center'>
    <h2 className='text-center text-darkblue text-2xl mb-5 font-montserrat font-extrabold'>Enregistre tes Briefs</h2>
    <p className='text-or font-extrabold text-2xl mb-3'>Ajoute tes créations</p>
    <p className="text-2xl">Elles apparaîtront ici.</p>
  </div>
}
else {
  cards = listeCreations.map((creation, i) => {
    //creations are not displayed if private
    if (creation.private) {
      return null;
    }
    return ( 
      <div>


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
      </div>
    );
  });
}


  return (
    <div className="font-montserrat">
    <h3 className="text-center text-lightblue text-2xl font-montserrat font-semibold italic md:text-2xl lg:text-3xl">Découvrir & S'inspirer</h3>
    <h2 className="text-center text-darkblue text-3xl mb-20 font-montserrat font-extrabold md:text-3xl lg:text-5xl">Créations de la Communauté</h2>
      <div className="w-full flex-col justify-center items-center p-6 overflow-hidden md:flex md:flex-row">
        {cards}
      </div>
    </div>
);
  
}

export default CarouselHome;

import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { faInstagram, faTwitter, faLinkedinIn, faFacebookF} from "@fortawesome/free-brands-svg-icons";
import { faUser, faCommentAlt, faEnvelope, faBookmark } from '@fortawesome/free-solid-svg-icons';
import CardCommunaute from "./CardCommunaute";
//import { handleLikeLike } from "../modules/handleLike";

export default function Profils({ username }) {
  const router = useRouter();
  const [profilUser, setProfilUser] = useState({});
  const [formattedBio, setFormattedBio] = useState(null);
  const [reseaux, setReseaux] = useState();
  const [creationsData, setCreationsData] = useState();
  const [newMessage, setNewMessage] = useState('')
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [validMsg, setValidMsg] = useState();
  const modalToggleRef = useRef();
  const [followedCreations, setFollowedCreations] = useState([]);

  const user = useSelector((state)=> state.users.value);
//page publique profil



  useEffect(() => {
    fetch(`https://brief-creativ-backend.vercel.app/users/search/${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          if(data.user) {
            setProfilUser(data.user);
            if(data.user.profil_id) {
              if (data.user.profil_id?.bio) {
                const bioLines = data.user.profil_id.bio.split('\n');
                const formattedBioLines = bioLines.map((line, i) => {
                  if (line === '') {
                    return <br key={i} />;
                  } else {
                    return <p key={i} className="text-darkblue text-start w-300 text-base font-montserrat md:text-lg">{line}</p>;
                  }
                });
                setFormattedBio(formattedBioLines);
              } else {
                setFormattedBio(<p className="text-darkblue text-start w-300 text-base font-montserrat md:text-xl">L'utilisateur n'a pas de description</p>);
              }
              if (data.user.profil_id?.reseaux) {
                setReseaux(data.user.profil_id?.reseaux)
              }
    
              fetch(`https://brief-creativ-backend.vercel.app/briefs/user/${data.user._id}/creations`)
              .then(response => response.json())
              .then(creation =>{
                setCreationsData(creation.creations)
              })
            }
          }

        }
        
      });
  }, [username]);

  
useEffect(() => {
  if(profilUser._id) {
    checkFollowing();
  }
}, [profilUser._id]);

useEffect(() => {
  if (profilUser && profilUser.followed) {

      let creations = [];
      const fetchCreations = async () => {
          for (let followedUser of profilUser.followed) {
              const response = await fetch(`https://brief-creativ-backend.vercel.app/briefs/user/${followedUser}/creations`);
              const data = await response.json();
              if (data.result && data.creations) {
                //tri des créations par dates
                const sortedCreations = data.creations.sort((a, b) => new Date(b.date) - new Date(a.date))
                  creations = [...creations, sortedCreations[0]];
              }
          }
          setFollowedCreations(creations);
      }
      fetchCreations();
  }
}, [profilUser.followed]);

const foCrea = followedCreations.map((creation, i) => {
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
});

  const checkFollowing = async () => {
    try {
      const response = await fetch(`https://brief-creativ-backend.vercel.app/users/following/${user._id}/${profilUser._id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du suivi de l\'utilisateur');
      }
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

 
    const socialIcons = {
      facebook: faFacebookF,
      twitter: faTwitter,
      instagram: faInstagram,
      linkedin: faLinkedinIn,
    };
  
    const renderLinks = () => {
      const reseauxData = Object.entries(reseaux).map(([key, value]) => {
        if (key === '_id') {
          return null; 
        }
        if (value) {
          return (
            <Link key={key} href={value}>
              <div className="bg-lightblue rounded-full mx-1 flex text-darkblue justify-center items-center ease-in-out duration-300 hover:bg-darkblue hover:text-lightblue" style={{width: '50px', height: '50px'}}>
                <FontAwesomeIcon icon={socialIcons[key]} style={{height: "25px"}}/>
              </div>
            </Link>
          );
        }
        return null;
      });
      
      if (reseauxData.filter((link) => link !== null).length === 0) {
        return <p>Aucun lien disponible</p>;
      }
      
      return reseauxData;
    };
  
  
  if (!profilUser.profil_id) {
    return <div>Chargement</div>
  };

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
        setCreationsData(prevCreations => {
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

const sendMessage = (receiveUser)=>{
  fetch('https://brief-creativ-backend.vercel.app/messages/send',{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: user.token,
    },
    body: JSON.stringify({
      receiveUser: receiveUser,
      message: newMessage,
    })
  })
  .then(response => response.json())
  .then(data=>{
    if (data.result){ 
    setValidMsg('Ton message a bien été envoyé !')
    setTimeout(()=>{
      setNewMessage('')
      setValidMsg('')
      if (modalToggleRef.current) {
        modalToggleRef.current.checked = false;
        }
    },2000) 
    }else{
      setErrorMsg("Erreur de l'envoi du message")
      setTimeout(()=>{
        setErrorMsg("")
      },2000)
    }
  })
}

  const creations = creationsData?.map((data, i) =>{
    //creations are not displayed if private
    if (data.private) {
      return null;
    }

    return <CardCommunaute
    key={i}
    img={data.images}
    autor={data.autor.username}
    projectType={data.brief_id.projectType}
    entrepriseType={data.brief_id.entrepriseType}
    styleType= {data.brief_id.styleType}
    brief={data.brief_id}
    likeNumber={data.like?.length}
    onLike={() => handleLike(data._id)}
    creationId={data._id}
    liked={data.like.includes(user._id)}
    />
  })

  const followUser = async () => {
    try {
      const response = await fetch('https://brief-creativ-backend.vercel.app/users/follow', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token,
        },
        body: JSON.stringify({
          followerId: user._id,
          followedId: profilUser._id,
        }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors du suivi de l\'utilisateur');
      }
      setIsFollowing(true);
    } catch (err) {
      console.error(err);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await fetch('https://brief-creativ-backend.vercel.app/users/unfollow', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token,
        },
        body: JSON.stringify({
          followerId: user._id,
          followedId: profilUser._id,
        }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'arrêt du suivi de l\'utilisateur');
      }
      setIsFollowing(false);
    } catch (err) {
      console.error(err);
    }
  };

 

  
  return (
    <div className="mt-10 w-full md:flex md:justify-center">
      <div className="flex  flex-col items-center md:w-1/3">
        {/* AVATAR + USER/BIO */}
        <div className="flex flex-col w-full items-center">
          <div className="mb-5 flex flex-col items-center">
            <div>
              {profilUser.profil_id.avatar ? (<Image
                className="rounded-full object-cover object-center"
                src={profilUser.profil_id.avatar}
                width={250}
                height={250}
              />) : (<div className="rounded-full bg-slate-200 flex items-center justify-center" style={{height: "250px", width: "250px"}}>
                <FontAwesomeIcon icon={faUser} style={{ height: "70px" }}/>
              </div>)}
              </div>
          </div>

          <div className="px-5 mx-5">
            <div className="flex flex-col items-center w-full mt-10 md:mt-0">
              <p className="text-darkblue text-center text-4xl font-semibold font-montserrat md:text-5xl">
                {profilUser.username}
              </p>
            </div>

            <div className="flex flex-col mt-5">
              <p className="mb-5 text-darkblue text-center text-xl font-montserrat md:text-xl lg:text-2xl">
                Présentation:
              </p>
                  {formattedBio}
            </div>
          </div>
        </div>
        {/* {reseau sociaux} */}
        <div>
          <div>
            <h3 className="my-5 text-darkblue text-center text-xl font-montserrat md:text-xl lg:text-2xl">Les réseaux de {profilUser.username} :</h3>
          </div>
          <div className="flex flex-row items-center justify-center">
            {renderLinks()}
          </div>
        </div>
        <div>
      { /* ne pas afficher si username == userconnecté */
        (user.username !== profilUser.username) &&
        (isFollowing ?
        <button onClick={unfollowUser} className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue">
          <FontAwesomeIcon icon={faBookmark} /> Retirer de vos favoris
        </button> :
        <button onClick={followUser} className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue">
          <FontAwesomeIcon icon={faBookmark} /> Ajouter à vos favoris
        </button>)
      }
    </div>
    {(user.username !== profilUser.username) &&
        <div className="my-10">
            <label htmlFor="my-modal" className="py-2 px-4 text-base cursor-pointer rounded-lg mb-5 bg-lightblue text-white mt-5 md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue">
              <FontAwesomeIcon icon={faEnvelope} /> Contacter</label>
            <input type="checkbox" id="my-modal" className="modal-toggle" ref={modalToggleRef}/>
            <div className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Votre message à {profilUser.username}</h3>
                <textarea
                    type="text"
                    className="input input-bordered h-48 input-warning w-full max-w-xs md:max-w-md resize-none leading-normal"
                    placeholder="Saisis ton message !"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  />
                  {errorMsg && <p className="text-rouge text-center text-xs">{errorMsg}</p>}
                  {validMsg && <p className="text-lightblue text-center text-xs">{validMsg}</p>}
                <div className="modal-action flex items-center">
                  <button className="py-2 px-4 text-base rounded-lg mb-5 bg-lightblue text-white mt-5 md:text-xl lg:text-2xl" onClick={()=>sendMessage(profilUser.username)}>
                    Envoyer
                  </button>
                  <label htmlFor="my-modal" className="btn">Fermer</label>
                </div>
              </div>
            </div>
        </div>
        }
      </div >
      <div className="flex flex-col justify-between">
      <div className="flex flex-col md:w-2/3 md:mx-10">
      <p className="my-10 text-darkblue text-center font-bold text-2xl font-montserrat md:text-3xl">
          Les Créations de {profilUser.username} :
      </p>
      <div className="flex flex-wrap justify-center items-center">
        {creations ? creations : (<div className="bg-or/10 p-10 rounded-xl w-full text-center">{profilUser.username} n'a pas de créations publiques.</div>) }
      </div>
      </div>
      <div className="flex flex-col items-center mt-5">
        <p className="my-10 text-darkblue text-center text-2xl font-bold font-montserrat md:text-xl lg:text-2xl">
          Les utilisateurs suivis par {profilUser.username} :
        </p>
        <div className="flex flex-wrap justify-center items-center place-content-start md:-mt-5">{foCrea}</div>
      </div>
      </div>
    </div>
  );
}

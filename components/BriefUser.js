import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useRef } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Helmet } from "react-helmet";
import {
  EmailIcon, FacebookIcon, LinkedinIcon, PinterestIcon, TwitterIcon, WhatsappIcon,
  EmailShareButton, FacebookShareButton, LinkedinShareButton, PinterestShareButton, TwitterShareButton, WhatsappShareButton,
} from "react-share";

export default function BriefUser({ creationId }) {
  //Creation Page => lorsqu'on consulte une création 

  //holds creation's author username
  const [userName, setUserName] = useState("");

  //holds briefs and creations' data
  const [briefData, setBriefData] = useState({});
  const [creationData, setCreationData] = useState({});

  //holds creations author's comments
  const [creationType, setCreationType] = useState("");

  //holds comments' data
  const [comment, setComment] = useState("");

  const user = useSelector((state) => state.users.value)
  //const dispatch = useDispatch();

  //ref to comment button
  const buttonRef = useRef();
  const [avatar, setAvatar] = useState('');

  //Fetch creation's data from db
  useEffect(() => {
    async function fetchData() {
      try {
        // get creation's data
        const response = await fetch(`https://brief-creativ-backend.vercel.app/briefs/creations/${creationId}`);
        const data = await response.json();

        setBriefData(data.brief_id);
        setCreationData(data);
        setUserName(data.autor.username);
        setCreationType(data.description_autor);
   
        // recup avatar
        // va chercher infos de l'user
        fetch('https://brief-creativ-backend.vercel.app/users/search/'+data.autor.username)
        .then(response => response.json())
        .then( dataUs => {
  
          if(dataUs.user.profil_id.avatar) {
            setAvatar(dataUs.user.profil_id?.avatar);
          }
        })

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [creationId, avatar]);



  //loading if there's no data 
  if (!briefData || !creationData || !userName) {
    return <div>Loading...</div>;
  }

  const metaTitle ="Brief créatif de "+user.username;
  const metaDescription = "Découvrez la création graphique de "+user.username+". Son Brief généré sur notre site : un projet type : "+briefData.projectType+", de style : "+briefData.styleType+", pour cette entreprise : "+briefData.entrepriseType;
  
  //handle likes on creations and post them to db

  const handleLike = async () => {
    try {

      const response = await fetch(`https://brief-creativ-backend.vercel.app/briefs/creationsLikes/${creationData._id}/like`, {
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

      setCreationData(prevCreation => {
        return {
          ...prevCreation,
          like: data.likes
        };
      });



    } catch (err) {
      console.error(err.message);
    }
  };

  //handle comments on creation

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://brief-creativ-backend.vercel.app/briefs/creations/${creationId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
          body: JSON.stringify({ message: comment }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du commentaire");
      }

      const data = await response.json();

      setCreationData((prevCreation) => {
        return {
          ...prevCreation,
          commentaires: [...prevCreation.commentaires, data.comment],
        };
      });

      //Clear textarea box
      setComment("");

    } catch (err) {
      console.error(err.message);
    }
    buttonRef.current.blur();
  };

  //handle likes on comments

  const handleLikeComment = async (commentId) => {
    try {
      const response = await fetch(
        `https://brief-creativ-backend.vercel.app/briefs/creations/${creationId}/comment/${commentId}/like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la mise à jour des likes du commentaire"
        );
      }

      const data = await response.json();

      setCreationData((prevCreation) => {
        return {
          ...prevCreation,
          commentaires: prevCreation.commentaires.map((commentaire) =>
            commentaire._id === commentId ? data.comment : commentaire
          ),
        };
      });


    } catch (err) {
      console.error(err.message);
    }
  };

  //handle comment's deletion

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://brief-creativ-backend.vercel.app/briefs/creations/${creationId}/comment/${commentId}`, {
          method: 'DELETE',
          headers: {
            "Authorization": user.token
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du commentaire');
        }

        setCreationData(prevCreation => {
          return {
            ...prevCreation,
            commentaires: prevCreation.commentaires.filter(commentaire => commentaire._id !== commentId)
          };
        });


      } catch (err) {
        console.error(err.message);
      }
    }
  };

const shareUrl = window.location; // nom de la page


  return (
    <div className="flex flex-col m-8">
      <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription}/>
      </Helmet> 
      {/*  Image user + Titre  */}
      <section className="flex lg:flex-row flex-col justify-between items-center">
        
        <h1 className="text-lg flex flex-row justify-center items-center">
          <figure className="flex mr-5">
            {avatar ? (<Image
                className="rounded-full object-cover object-center h-20 w-20"
                src={avatar} width={100} height={100}
              />) : (<div className="rounded-full bg-slate-200 flex items-center justify-center" style={{height: "100px", width: "100px"}}>
              <FontAwesomeIcon icon={faUser} style={{ height: "40px" }}/>
            </div>)}
          </figure>
          <span className="text-3xl">Brief Créatif de <Link href={`/profil/${userName}`}><span className="cursor-pointer hover:underline">{userName}</span></Link></span>
        </h1>
        <div className="ml-2 flex flex-row cursor-pointer justify-end">
            <FontAwesomeIcon
              icon={faHeart}
              beatFade
              className={
                creationData.like.includes(user._id)
                  ? "text-red-600"
                  : "text-gray-400"
              }
              onClick={handleLike}
            />
            <span className="pl-3">{creationData.like.length}</span>
            <div className="tooltip" data-tip="Envoyer à un ami">
              <EmailShareButton url={shareUrl}> <EmailIcon size={32} round={true} className="ml-2 text-right cursor-pointer" /> </EmailShareButton>
            </div>
            <div className="tooltip" data-tip="Partager sur Twitter">
              <TwitterShareButton url={shareUrl}> <TwitterIcon size={32} round={true} className="ml-2 text-right cursor-pointer" /> </TwitterShareButton>
            </div>
            <div className="tooltip" data-tip="Partager sur Facebook">
              <FacebookShareButton url={shareUrl}><FacebookIcon size={32} round={true} className="ml-2 text-right cursor-pointer" /></FacebookShareButton>
            </div> {/*
            <div className="tooltip" data-tip="Partager sur Pinterest">
              <PinterestShareButton url={shareUrl}><PinterestIcon size={32} round={true} className="ml-2 text-right cursor-pointer" /></PinterestShareButton>
            </div> */}
            <div className="tooltip" data-tip="Partager sur Linkedin">
              <LinkedinShareButton url={shareUrl}><LinkedinIcon size={32} round={true} className="ml-2 text-right cursor-pointer" /></LinkedinShareButton>
            </div>
            <div className="tooltip" data-tip="Partager sur Whatsapp">
              <WhatsappShareButton url={shareUrl}><WhatsappIcon size={32} round={true} className="ml-2 text-right cursor-pointer" /></WhatsappShareButton>
            </div>
        </div>
      </section>

      <div className="flex flex-col justify-center lg:flex-row lg:justify-center lg:items-start">
        <section className="flex flex-col justify-center mt-3 relative lg:w-1/3 lg:mb-12">
          {/* Brief */}
          <section className="flex flex-col rounded-xl border-1 border-or drop-shadow-lg p-6 bg-white">
            <h3 className="text-darkblue text-lg font-montserrat font-extrabold lg:text-3xl mb-6">
              Brief créatif
            </h3>
            <p className="text-darkblue text-base lg:text-2xl">
              <span className="text-darkblue text-base font-medium lg:font-semibold lg:text-lg">
                {briefData.entrepriseSentence}
              </span>
            </p>
            <div className="text-darkblue text-base mt-6 lg:text-2xl">
              <p className="text-darkblue text-base font-medium lg:font-semibold lg:text-lg">
                {briefData.projectSentence}
              </p>
              <p className="text-darkblue text-base mt-3 font-medium lg:font-semibold lg:text-lg">
                {briefData.styleSentence}
              </p>
              <p className="text-rouge text-base mt-3 font-semibold lg:text-lg">
                Penses-tu pouvoir relever le défi en {briefData.delay} heures ?
              </p>
            </div>

            {/* Couleurs */}
            <aside className="flex flex-row mt-10 lg:mt-20 md:flex-row justify-center lg:1/3">
              {briefData.color.map((color, index) => (
                <div
                  className="flex flex-col justify-center items-center"
                  key={index}
                >
                  <div className=''>
                      <div style={ { backgroundColor: color, height:50, width: 50 }} className='md:pr-15 pr-16 mr-2'></div>
                      <span className='text-sm'>{color}</span>
                  </div>
                </div>
              ))}
            </aside>
          </section>
        </section>

        <section className="flex w-full flex-col lg:items-center lg:w-2/3 mt-3">

          <div className="flex flex-col lg:ml-7 items-center">
            <table class="table-fixed w-full text-left capitalize border-collapse border border-slate-200 rounded border-spacing-2">
              <thead>
                <tr>
                  <th>Type de projet</th>
                  <th>Style</th>
                  <th>Type d'entreprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{briefData.projectType}</td>
                  <td>{briefData.styleType}</td>
                  <td>{briefData.entrepriseType}</td>
                </tr>
                </tbody>
            </table>
           
            {/* Creation */}
            <figure className="flex flex-col mt-5 items-center">
              {creationData.images.map((image, index) => (
                <img
                  key={index}
                  className="object-cover rounded-xl mb-5"
                  src={image}
                  width="800"
                  height='800'
                />
              ))}
            </figure>
            {creationType !== "" ? (
              <div className="mt-5 text-xl">
                {creationType}
              </div>
            ) : "" }

            {/* Comment box */}
            <section className="bg-whitepink p-4 rounded-xl shadow my-8 w-full">
              <form
                onSubmit={handleSubmitComment}
                className="flex flex-col items-center w-full"
              >
                <label className="text-gray-900 font-medium my-5 w-full">
                  Commentaire :
                  <textarea
                    className="my-5 w-full p-4 block rounded-lg border-gray-300 shadow-md focus:border-indigo-100 focus:ring focus:ring-indigo-100 focus:ring-opacity-50"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </label>
                <button
                  ref={buttonRef}
                  type="submit"
                  className="w-48 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-lightblue hover:bg-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkblue"
                >
                  Envoyer
                </button>
              </form>
            </section>

            {/* Comments */}
            <section className="space-y-5 w-full">
              {creationData.commentaires.map((commentaire, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow w-full"
                >
                  <div className="flex items-start">
                    {/* Avatar + username */}
                    <div className="flex flex-col items-center m-2 space-y-2">
                      {commentaire.user_id.profil_id.avatar ? (<Image
                        className="avatar rounded-full m-2 mt-1"
                        src={commentaire.user_id.profil_id.avatar}
                        height={35}
                        width={35}
                      />) : (<div className="rounded-full flex items-center justify-center bg-slate-200" style= {{width: "35px", height: "35px"}}>
                      <FontAwesomeIcon icon={faUser} size={20} />
                      </div>
                      )}
                      <Link href={`/profil/${commentaire.user_id.username}`}>
                        <span className="text-xs text-gray-600">
                          {commentaire.user_id.username}
                        </span>
                      </Link>
                    </div>

                    {/* Posted comment */}
                    <div className="space-y-3 w-full">
                      {/* Comment */}
                      <p className="ml-4 text-gray-900 font-normal">
                        {commentaire.message}
                      </p>
                      {/* Comment likes + delete comment */}
                      <div className="flex justify-between">
                        <span className="ml-2 flex items-center">
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={
                              commentaire.like.includes(user._id)
                                ? "text-red-600"
                                : "text-gray-400"
                            }
                            onClick={() => handleLikeComment(commentaire._id)}
                          />
                          <span className="pl-2">
                            {commentaire.like.length}
                          </span>
                        </span>
                        <span className="pl-2 flex items-center">
                          {commentaire.user_id._id === user._id && (
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-gray-400"
                              onClick={() =>
                                handleDeleteComment(commentaire._id)
                              }
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </section>
      </div>
    </div>
  );

}
import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateName, updateMail, updateAvatar, logOut } from "../reducers/users";
import CardCommunaute from './CardCommunaute';
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faLinkedinIn, faFacebookF } from "@fortawesome/free-brands-svg-icons";

//Private user's page
export default function Profil() {
  const user = useSelector((state) => state.users.value);
  const dispatch = useDispatch();
  const [profilUser, setProfilUser] = useState({});
  const [followedCreations, setFollowedCreations] = useState([]);
  const [userInfo, setUserInfo] = useState({})
    // Recupère les infos du profil d'un user
  useEffect(() => {
    fetch("https://brief-creativ-backend.vercel.app/profils", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfilUser(data.profil);
        setCurrentImage(data.profil.avatar)
      });
  }, []);

  useEffect (()=>{
    fetch(`https://brief-creativ-backend.vercel.app/users/search/${user.username}`)
    .then((response)=> response.json())
    .then((data) => {
      setUserInfo(data.user)
    })
  },[user])

 

  //mise a jour des infos profil
  useEffect(() => {
    setNewBio(profilUser.bio);

  }, [profilUser.bio]);

  useEffect(() => {
    if (profilUser.reseaux) {
      if (profilUser.reseaux.facebook) {
        setRsFb(profilUser.reseaux.facebook);
      }
      if (profilUser.reseaux.instagram) {
        setRsIg(profilUser.reseaux.instagram);
      }
      if (profilUser.reseaux.linkedin) {
        setRsLk(profilUser.reseaux.linkedin);
      }
      if (profilUser.reseaux.twitter) {
        setRsTw(profilUser.reseaux.twitter);
      }
    }
  }, [profilUser.reseaux]);
  
  //get user's following

  useEffect(() => {
    if (userInfo && userInfo.followed) {
  
        let creations = [];
        const fetchCreations = async () => {
            for (let followedUser of userInfo.followed) {
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
}, [userInfo.followed]);



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

        setFollowedCreations(prevCreations => {
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

  
  // useRef modal avatar
  const modalToggleRef = useRef(null);
  // useState for avatar
  const [newFile, setNewFile] = useState("");
  const [currentImage, setCurrentImage] = useState(null)

  // useState for username
  const [newUsername, setNewUsername] = useState(user.username);
  const [errorName, setErrorName] = useState("");
  const [validName, setValidName] = useState("");

  // useState for bio
  const [newBio, setNewBio] = useState("");
  const [validBio, setValidBio] = useState("");
  const [errorBio, setErrorBio] = useState("");

  // useState for Mail
  const [verifMdpMail, setVerifMdpMail] = useState(false);
  const [mdpMail, setMdpMail] = useState("");
  const [newMail, setNewMail] = useState(user.email);
  const [errorMdpMail, setErrorMdpMail] = useState("");
  const [validMdpMail, setValidMdpMail] = useState("");

  // useState for MDP
  const [btnMdp, setBtnMdp] = useState(false);
  const [actuelMdp, setActuelMdp] = useState("");
  const [newMdp, setNewMdp] = useState("");
  const [verifMdp, setVerifMdp] = useState("");
  const [errorMdp, setErrorMdp] = useState("");
  const [validMdp, setValidMdp] = useState("");

  // useState for RS
  const [rsFb, setRsFb] = useState("");
  const [rsLk, setRsLk] = useState("");
  const [rsTw, setRsTw] = useState("");
  const [rsIg, setRsIg] = useState("");
  const [errorRs, setErrorRs] = useState("");
  const [validRs, setValidRs] = useState("");

  //useState for DELETE
  const [mdpDel, setMdpDel] = useState("");
  const [errorDel, setErrorDel] = useState("")

  // Gestion Image avatar
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        250,
        250,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const btnAvatar = async () => {
    const okTypes = ["image/jpeg", "image/png"];
    if (!okTypes.includes(newFile.type)) {
      console.error("raté petit trou du cul va");
    } else {
      try {
        const image = await resizeFile(newFile);
        const formData = new FormData();
        formData.append("avatar", image);
        fetch("https://brief-creativ-backend.vercel.app/profils/avatar", {
          method: "POST",
          headers: { Authorization: user.token },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
                fetch("https://brief-creativ-backend.vercel.app/profils", {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json", Authorization: user.token},
                    body: JSON.stringify({
                        avatar: data.url,
                    }),
                  })
                .then(response => response.json())
                .then((upPic)=>{
                  if (upPic.result) {
                    setNewFile('');
                    setCurrentImage(upPic.profil.avatar)
                    dispatch(updateAvatar(currentImage))
                    if (modalToggleRef.current) {
                      modalToggleRef.current.checked = false;
                    }
                  }
                })
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  };



  // Change username
  let borderStyle = {};
  const usernameClick = () => {

    if (newUsername.length < 3) {
      setErrorName("Le nom doit comporter au minimum 3 caractères");
      borderStyle = { borderColor: "#ED7F5C" };
      setTimeout(() => {
        setErrorName("");
        borderStyle = {};
      }, 5000);
      return;
    }
    fetch(`https://brief-creativ-backend.vercel.app/users/search/${newUsername}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setErrorName("Le nom d'utilisateur existe déjà");
          borderStyle = { borderColor: "#ED7F5C" };
          setTimeout(() => {
            setErrorName("");
            borderStyle = {};
          }, 5000);
          return;
        } else {
          fetch(`https://brief-creativ-backend.vercel.app/users/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token,
              },
            body: JSON.stringify({
              username: newUsername,
            }),
          })
            .then((response) => response.json())
            .then(() => {
              setValidName("Nouveau nom enregistré avec succès !");
              dispatch(updateName(newUsername));
              setTimeout(() => {
                setValidName("");
              }, 5000);
            });
        }
      });
  };

  // Change bio
  const bioClick = () => {
    fetch("https://brief-creativ-backend.vercel.app/profils", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
      body: JSON.stringify({
        bio: newBio,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setValidBio("Nouvelle bio enregistrée avec succès !");
          setTimeout(() => {
            setValidBio("");
          }, 5000);
        } else {
          setErrorBio("Oups, quelquechose s'est mal passé, veuillez réessayer");
          setTimeout(() => {
            setErrorBio("");
          }, 5000);
        }
      });
  };

  // Display input MDP for change Email
  const mailClick = () => {
    if (!verifMdpMail) {
      setVerifMdpMail(true);
    } else {
      setVerifMdpMail(false);
    }
  };
  // Change Mail
  const modifyMail = () => {
    fetch("https://brief-creativ-backend.vercel.app/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
      body: JSON.stringify({
        email: newMail,
        password: mdpMail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setValidMdpMail("Votre E-Mail a bien été modifié !");
          dispatch(updateMail(newMail));
          setTimeout(() => {
            setValidMdpMail("");
            setVerifMdpMail(false);
          }, 5000);
        } else {
          setErrorMdpMail(data.message);
          setTimeout(() => {
            setErrorMdpMail("");
          }, 5000);
        }
      });
  };

  // Display input MDP
  const mdpClick = () => {
    if (!btnMdp) {
      setBtnMdp(true);
    } else {
      setBtnMdp(false);
    }
  };
  // Change MDP
  const modifyMdp = () => {
    if (newMdp !== verifMdp) {
      setErrorMdp(
        "Les champs nouveau mot de passe et verification ne sont pas identiques"
      );
      setActuelMdp("");
      setNewMdp("");
      setVerifMdp("");
      setTimeout(() => {
        setErrorMdp("");
      }, 5000);
    } else {
      fetch("https://brief-creativ-backend.vercel.app/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({
          password: actuelMdp,
          newPassword: newMdp,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setValidMdp("Votre mot de passe a bien été modifié");
            setTimeout(() => {
              setValidMdp("");
              setBtnMdp(false);
            }, 5000);
            setActuelMdp("");
            setNewMdp("");
            setVerifMdp("");
          } else {
            setErrorMdp("Le mot de passe actuel n'est pas le bon");
            setActuelMdp("");
            setNewMdp("");
            setVerifMdp("");
            setTimeout(() => {
              setErrorMdp("");
            }, 5000);
          }
        });
    }
  };

  // Ajouter des RS
  //Creation regex + message d'erreur
  const regexMap = {
    instagram: {
      regex: /^(https:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+\/?$/,
      errorMessage: "Le champ instagram n'est pas valide",
    },
    twitter: {
      regex: /^(https:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_.-]+\/?$/,
      errorMessage: "Le champ twitter n'est pas valide",
    },
    facebook: {
      regex: /^(https:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_.-]+\/?$/,
      errorMessage: "Le champ facebook n'est pas valide",
    },
    linkedin: {
      regex: /^(https:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9_.-]+\/?$/,
      errorMessage: "Le champ linkedin n'est pas valide",
    },
  };
  //fonction enregistrement RS dans profil
  const sendRs = () => {
    const errorMessages = [];
    const recordRs = {};
    const mapping = {
      rsFb: "facebook",
      rsLk: "linkedin",
      rsTw: "twitter",
      rsIg: "instagram",
    };
  
    for (let key in mapping) {
      if (mapping.hasOwnProperty(key)) {
        const value = eval(key);
        if (value !== undefined) {
          recordRs[mapping[key]] = value;
        }
      }
    }
  
    for (let key in recordRs) {
      if (recordRs.hasOwnProperty(key)) {
        const regex = regexMap[key].regex;
        const url = recordRs[key];
        
        if (url !== "") {
          const isValid = regex.test(url);
          if (!isValid) {
            errorMessages.push(regexMap[key].errorMessage);
          }
        }
      }
    }
  
    if (errorMessages.length > 0) {
      setErrorRs(errorMessages.join(",\n"));
      setTimeout(() => {
        setErrorRs("");
      }, 5000);
      return;
    } else {
      fetch("https://brief-creativ-backend.vercel.app/profils", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify(recordRs),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setValidRs("La modification a bien été enregistrée");
            setTimeout(() => {
              setValidRs("");
            }, 5000);
          }
        });
    }
  };

  const disconnect = () => {
    dispatch(logOut());
    window.location.replace("/"); // redirect to Home
  };

  const userDel = () => {
    fetch("https://brief-creativ-backend.vercel.app/users/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
      body: JSON.stringify({
        password: mdpDel
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(logOut());
          window.location.replace("/");
        }
      });
  };
  return (
    <div className="mt-10">
      <div className="flex flex-col items-center">
        {/* AVATAR + USER/BIO */}
        <div className="flex flex-col w-full items-center md:flex-row md:justify-center">
          <div className="flex flex-col items-center md:mb-0">
            {currentImage ? (
              <Image
                className="rounded-full object-cover object-center"
                src={currentImage}
                width={250}
                height={250}
              />
            ) : (
              <div
                className="rounded-full bg-slate-200 flex items-center justify-center"
                style={{ height: "250px", width: "250px" }}
              >
                <FontAwesomeIcon icon={faUser} style={{ height: "70px" }} />
              </div>
            )}
            <label
              htmlFor="my-modal"
              className="btn mt-5 bg-lightblue border-none cursor-pointer focus:bg-darkblue"
            >
              Nouvel avatar
            </label>
            <input
              type="checkbox"
              id="my-modal"
              className="modal-toggle"
              ref={modalToggleRef}
            />
            <div className="modal">
              <div className="modal-box">
                <label
                  htmlFor="my-modal"
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                >
                  ✕
                </label>
                <h3 className="font-bold text-lg">Importe un nouvel avatar</h3>
                <p className="py-4">Sélectionne un fichier de type image</p>
                <div className="modal-action flex flex-col items-center justify-center">
                  <input
                    accept="image/png, image/jpeg"
                    type="file"
                    className="py-3 px-1 text-base rounded-lg bg-lightblue mb-2 text-white file:bg-lightblue file:border-none"
                    onChange={(e) => setNewFile(e.target.files[0])}
                  />
                  <div className="flex justify-center">
                    <button
                      className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mr-5 md:text-xl"
                      onClick={btnAvatar}
                    >
                      Valider
                    </button>
                    <label htmlFor="my-modal" className="btn">
                      Retour
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 md:w-96">
            <div className="flex flex-col items-center w-full mt-10">
              <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                Nom d'utilisateur :
              </p>
              <input
                type="text"
                placeholder="Votre nouveau nom"
                className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                style={borderStyle}
                onChange={(e) => setNewUsername(e.target.value)}
                value={newUsername}
              />
              {errorName && (
                <p className="text-rouge text-center text-xs">{errorName}</p>
              )}
              {validName && (
                <p className="text-lightblue text-center text-xs">
                  {validName}
                </p>
              )}
              <button
                className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl"
                onClick={usernameClick}
              >
                <FontAwesomeIcon icon={faSave} size="md" className="pr-2" />
                Valider
              </button>
            </div>

            <div className="flex flex-col items-center w-full mt-5">
              <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                Bio:
              </p>
              <textarea
                type="text"
                className="input input-bordered h-48 input-warning w-full max-w-xs md:max-w-md resize-none leading-normal"
                placeholder="Fais ta promo en quelques lignes, lâche-toi !"
                onChange={(e) => setNewBio(e.target.value)}
                value={newBio}
              />
              {errorBio && (
                <p className="text-rouge text-center text-xs">{errorBio}</p>
              )}
              {validBio && (
                <p className="text-lightblue text-center text-xs">{validBio}</p>
              )}
              <button
                className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl"
                onClick={bioClick}
              >
                <FontAwesomeIcon icon={faSave} size="md" className="pr-2" />
                Valider
              </button>
            </div>
          </div>
        </div>

        <div className="w-screen">
          <div className="flex flex-col items-center w-full mt-5">
            <p className="text-darkblue text-center text-base font-semibold font-montserrat my-10 md:text-xl lg:text-2xl">
              Information de Compte :
            </p>
            <div className="flex flex-col items-center w-full">
              <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                Adresse e-mail :{" "}
              </p>
              <input
                type="text"
                placeholder="b@gmail.fr"
                className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                onChange={(e) => setNewMail(e.target.value)}
                value={newMail}
              />
              {!verifMdpMail ? (
                <button
                  className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl"
                  onClick={mailClick}
                >
                  <FontAwesomeIcon icon={faSave} size="md" className="pr-2" />
                  Modifier l'adresse e-mail
                </button>
              ) : (
                <>
                  <div className="flex flex-col items-center w-full mt-5">
                    <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                      Mot de passe actuel :
                    </p>
                    <input
                      type="password"
                      placeholder="*******"
                      className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                      onChange={(e) => setMdpMail(e.target.value)}
                      value={mdpMail}
                    />
                    {errorMdpMail && (
                      <p className="text-rouge text-center text-xs">
                        {errorMdpMail}
                      </p>
                    )}
                    {validMdpMail && (
                      <p className="text-lightblue text-center text-xs">
                        {validMdpMail}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 mr-5 md:text-xl lg:text-2xl"
                      onClick={modifyMail}
                    >
                      <FontAwesomeIcon
                        icon={faSave}
                        size="md"
                        className="pr-2"
                      />
                      Valider
                    </button>
                    <button
                      className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl"
                      onClick={mailClick}
                    >
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </div>
            <p className="text-darkblue text-center text-base font-semibold font-montserrat mt-10 md:text-xl lg:text-2xl">
              Mot de passe :{" "}
            </p>
            {btnMdp && (
              <>
                <div className="flex flex-col items-center w-full mt-5">
                  <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                    Mot de passe actuel :
                  </p>
                  <input
                    type="password"
                    placeholder="*******"
                    className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                    onChange={(e) => setActuelMdp(e.target.value)}
                    value={actuelMdp}
                  />
                </div>
                <div className="flex flex-col items-center w-full mt-5">
                  <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                    Votre nouveau mot de passe :
                  </p>
                  <input
                    type="password"
                    placeholder="*******"
                    className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                    onChange={(e) => setNewMdp(e.target.value)}
                    value={newMdp}
                  />
                </div>
                <div className="flex flex-col items-center w-full mt-5">
                  <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                    Vérifier votre nouveau mot de passe :
                  </p>
                  <input
                    type="password"
                    placeholder="*******"
                    className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                    onChange={(e) => setVerifMdp(e.target.value)}
                    value={verifMdp}
                  />
                  {errorMdp && (
                    <p className="text-rouge text-center text-xs">{errorMdp}</p>
                  )}
                  {validMdp && (
                    <p className="text-lightblue text-center text-xs">
                      {validMdp}
                    </p>
                  )}
                </div>
              </>
            )}
            {!btnMdp ? (
              <button
                className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl"
                onClick={mdpClick}
              >
                Modifier mot de passe
              </button>
            ) : (
              <div className="flex justify-center">
                <button
                  className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 mr-5 md:text-xl lg:text-2xl"
                  onClick={modifyMdp}
                >
                  <FontAwesomeIcon icon={faSave} size="md" className="pr-2" />
                  Valider
                </button>
                <button
                  className="py-2 px-4 text-base rounded-lg bg-lightblue text-white mt-5 md:text-xl lg:text-2xl"
                  onClick={mdpClick}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div>
          <p className="text-darkblue text-center text-base font-semibold font-montserrat mt-10 md:text-xl lg:text-2xl">
            Réseaux sociaux :{" "}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-center">
          <div className="flex flex-col items-center mt-5 lg:mr-5">
            <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
              Facebook :{" "}
            </p>
            <div className="form-control">
              <label className="input-group input-group-lg">
                <span>
                  <FontAwesomeIcon icon={faFacebookF} />
                </span>
                <input
                  type="text"
                  placeholder="Adresse FB"
                  className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                  onChange={(e) => setRsFb(e.target.value)}
                  value={rsFb}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center mt-5 lg:mr-5">
            <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
              Linkedin :{" "}
            </p>
            <div className="form-control">
              <label className="input-group input-group-lg">
                <span>
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </span>
                <input
                  type="text"
                  placeholder="Adresse Linkedin"
                  className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                  onChange={(e) => setRsLk(e.target.value)}
                  value={rsLk}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center mt-5 lg:mr-5">
            <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
              Twitter :{" "}
            </p>
            <div className="form-control">
              <label className="input-group input-group-lg">
                <span>
                  <FontAwesomeIcon icon={faTwitter} />
                </span>
                <input
                  type="text"
                  placeholder="Adresse Twitter"
                  className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                  onChange={(e) => setRsTw(e.target.value)}
                  value={rsTw}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center mt-5 lg:mr-5">
            <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
              Instagram :
            </p>
            <div className="form-control">
              <label className="input-group input-group-lg">
                <span>
                  <FontAwesomeIcon icon={faInstagram} />
                </span>
                <input
                  type="text"
                  placeholder="Adresse Instagram"
                  className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                  onChange={(e) => setRsIg(e.target.value)}
                  value={rsIg}
                />
              </label>
            </div>
          </div>
        </div>
        {errorRs && (
          <p className="text-rouge text-center mt-1 text-xs">{errorRs}</p>
        )}
        {validRs && (
          <p className="text-lightblue text-center mt-1 text-xs">{validRs}</p>
        )}
        <div className="flex flex-col items-center mt-1">
          <button
            className="py-2 px-4 text-base rounded-lg bg-lightblue text-white my-5 md:text-xl lg:text-2xl"
            onClick={sendRs}
          >
            <FontAwesomeIcon icon={faSave} size="md" className="pr-2" />
            Modifier les réseaux sociaux
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center mt-5">
        <p className="text-darkblue text-center text-base font-semibold font-montserrat my-10 md:text-xl lg:text-2xl">
          Je suis :
        </p>
        <div className="flex flex-wrap justify-center items-center place-content-start md:-mt-5">
          {foCrea}
        </div>
      </div>
      <div></div>
      <div className="flex justify-center items-center">
        <label
          htmlFor="delAccount"
          className="py-2 px-4 text-base rounded-lg bg-rouge text-white my-10 md:text-xl lg:text-2xl"
        >
          <FontAwesomeIcon icon={faTrash} size="md" className="pr-2" />
          Supprimez votre compte
        </label>
        <input type="checkbox" id="delAccount" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Vous êtes sur de vouloir supprimer votre compte ?
            </h3>
            <div className="flex flex-col items-center w-full mt-5">
              <p className="text-darkblue text-center text-base font-montserrat md:text-xl lg:text-2xl">
                Saisissez votre mot de passe pour la suppression du compte :
              </p>
              <input
                type="password"
                placeholder="*******"
                className="input input-bordered input-warning w-full max-w-xs md:max-w-md"
                onChange={(e) => setMdpDel(e.target.value)}
                value={mdpDel}
              />
            </div>
            <div className="flex justify-between items-end mt-10">
              <button
                className="py-2 px-4 text-base font-semibold rounded-lg bg-rouge text-white"
                onClick={userDel}
              >
                <FontAwesomeIcon icon={faTrash} size="md" className="pr-2" />
                SUPPRIMER
              </button>
              <label
                htmlFor="delAccount"
                className="py-2 px-4 text-base rounded-lg bg-darkblue text-white cursor-pointer"
              >
                Retour
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faImage, faUser } from "@fortawesome/free-solid-svg-icons";
//import { faUser } from '@fortawesome/free-regular-svg-icons';
import Link from "next/link";
import Image from "next/image";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { useDispatch, useSelector } from "react-redux";
import { logOut, updateNotification } from "../reducers/users";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.value);
  const [modalConnectOpenClose, setModalConnectOpenClose] =
    useState("modal-toggle");
  const [modalInscriptionOpenClose, setModalInscriptionOpenClose] =
    useState("modal-toggle");
  const [avatar, setAvatar] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const disconnect = () => {
    dispatch(logOut());
    window.location.replace("/"); // redirect to Home
  };
  const setmodalConnect = (retour) => {
    if (retour) setModalConnectOpenClose("hidden"); // ferme la modal
  };
  const setmodalInscription = (retour) => {
    if (retour) setModalInscriptionOpenClose("hidden"); // ferme la modal
  };

  useEffect(() => {
    fetch(`https://brief-creativ-backend.vercel.app/users/search/${user.username}`)
      .then((response) => response.json())
      .then((data) => {
  
        setAvatar(data.user.profil_id.avatar);
      });
  }, [user]);

  useEffect(() => {
    fetch("https://brief-creativ-backend.vercel.app/messages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // verifie si il y a des messages reçu non lus
        const updatedMessages = data.messages?.map((conversation) => {
          const lastMessage =
            conversation.messages[conversation.messages.length - 1];
          return {
            ...conversation,
            hasUnreadMessage:
              lastMessage &&
              lastMessage.send_user.username === user.username &&
              !lastMessage.vu,
          };
        });
        setAllMessages(updatedMessages);
      });
  }, [user]);

  useEffect(() => {
    const updatedMessages = allMessages?.map((conversation) => {
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      const hasUnreadMessage =
        !lastMessage.vu && lastMessage.receive_user.username === user.username;
      return {
        ...conversation,
        hasUnreadMessage: hasUnreadMessage,
      };
    });
    const isNotVu = updatedMessages?.some(
      (conversation) => conversation.hasUnreadMessage
    );
    dispatch(updateNotification(isNotVu));
  }, [allMessages]);

  const splitLocation = window.location.pathname; // nom de la page
  let mprofil = "";
  splitLocation === "/profil" ? (mprofil = "bg-slate-100") : (mprofil = "");
  let mprofilus = "";
  splitLocation === "/profil/"+user.username ? (mprofilus = "bg-slate-100") : (mprofilus = "");
  let mbriefs = "";
  splitLocation === "/briefs" ? (mbriefs = "bg-slate-100") : (mbriefs = "");
  let mmessagerie = "";
  splitLocation === "/messagerie" ? (mmessagerie = "bg-slate-100") : (mmessagerie = "");


  return (
    <div className="px-5">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <Link href="/">
            <div className="flex flex-row justify-center items-center text-black cursor-pointer">
              <FontAwesomeIcon
                icon={faHouse} bounce
                size="xs"
                className="pr-4 text-xl md:text-xs"
              />
              <span className="hidden md:block"> Accueil</span>
            </div>
          </Link>
        </div>
        <div className="navbar-center flex">
          <Link href="/communaute-creations">
            <div className="flex flex-row justify-center items-center text-black cursor-pointer">
              <FontAwesomeIcon
                icon={faImage}
                size="xs"
                className="pr-4 text-xl md:text-xs"
              />
              <span className="hidden md:block"> Créations</span>
            </div>
          </Link>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end dropdown-hover">
            <label tabIndex={0} className="m-1 flex items-center">
              {avatar ? (
                <Image
                  className="rounded-full"
                  src={avatar}
                  height={35}
                  width={35}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  size="xl"
                  className="text-xl md:text-xs"
                />
              )}
              <span className="hidden md:block pl-3"> { user.username ? user.username : "Mon compte" }</span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {user.token ? (
                <>
                  <li className={mbriefs}>
                    <Link href="/briefs">
                      <span className="focus:bg-whitepink/40 active:bg-whitepink/40">
                        Mes Briefs
                      </span>
                    </Link>
                  </li>

                  <li className={mprofil}>
                    <Link href="/profil/">
                      <span className="focus:bg-whitepink/40 active:bg-whitepink/40">
                        Mon profil
                      </span>
                    </Link>
                  </li>
                  <li className={mprofilus}>
                    <Link href={ "/profil/"+user.username}>
                      <span className="focus:bg-whitepink/40 active:bg-whitepink/40">
                        Profil public
                      </span>
                    </Link>
                  </li>
                  <li className={mmessagerie}>
                    <Link href={ "/messagerie"}>
                      <span className="focus:bg-whitepink/40 active:bg-whitepink/40">
                        Messagerie {user.notification && (
                          <sup className="bg-darkblue text-rouge rounded-full">new!</sup>
                          )}
                      </span>
                    </Link>
                  </li>
                  <li
                    className="focus:bg-whitepink/40 active:bg-whitepink/40"
                    onClick={() => disconnect()}
                  >
                    <label className="focus:bg-whitepink/40 active:bg-whitepink/40">
                      {" "}
                      Se déconnecter
                    </label>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:bg-whitepink/40">
                    <label
                      htmlFor="modal-connect"
                      className="focus:bg-whitepink/40 active:bg-whitepink/40"
                    >
                      Se connecter
                    </label>
                  </li>
                  <li className="hover:bg-whitepink/40">
                    <label
                      htmlFor="modal-inscription"
                      className="focus:bg-whitepink/40 active:bg-whitepink/40"
                    >
                      S'inscrire
                    </label>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div>
          <Image
            src="/brief-logo.png"
            width="600"
            height="200"
            alt="Brief Creativ - le générateur de briefs pour booster votre créativité"
          />
        </div>
      </div>

      <input
        type="checkbox"
        id="modal-connect"
        className={modalConnectOpenClose}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="modal-connect"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <SignIn setmodalConnect={setmodalConnect} />
        </div>
      </div>

      <input
        type="checkbox"
        id="modal-inscription"
        className={modalInscriptionOpenClose}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="modal-inscription"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <SignUp setmodalInscription={setmodalInscription} />
        </div>
      </div>
    </div>
  );
}

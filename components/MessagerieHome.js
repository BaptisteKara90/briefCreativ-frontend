import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateNotification } from '../reducers/users';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Messagerie } from "./Messagerie";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

export function MessagerieHome() {
  const user = useSelector((state) => state.users.value);
  const [targetReached, setTargetReached] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [justMessage, setJustMessage] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [sendBtn, setSendBtn] = useState();
  const [notification, setNotification] = useState();

  const conversationRef = useRef()
  const dispatch = useDispatch();

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
        // verifie si il y a des messages reçus non lus
        const updatedMessages = data.messages.map((conversation) => {
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
  }, []);

  useEffect(() => {
    const updatedMessages = allMessages.map((conversation) => {
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      const hasUnreadMessage =
        !lastMessage.vu && lastMessage.receive_user.username === user.username;
      return {
        ...conversation,
        hasUnreadMessage: hasUnreadMessage,
      };
    });
    const isNotVu = updatedMessages.some(
      (conversation) => conversation.hasUnreadMessage
    );
    setNotification(isNotVu);
    dispatch(updateNotification(isNotVu));
    console.log(notification);
  }, [allMessages]);

  const fetchMessages = (otherUser) => {
    fetch("https://brief-creativ-backend.vercel.app/messages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllMessages(data.messages);
        if (otherUser) {
          const updatedMessages = data.messages.find((conversation) =>
            conversation.messages.some(
              (message) =>
                message.send_user.username === otherUser ||
                message.receive_user.username === otherUser
            )
          );
          setJustMessage(updatedMessages?.messages || []);
        }
      });
  };

  const markAsRead = (messageId) => {
    console.log(messageId);
    fetch("https://brief-creativ-backend.vercel.app/messages/vu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
      body: JSON.stringify({
        _id: messageId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchMessages();
      });
  };

  const sendMessage = (otherUser) => {
    fetch("https://brief-creativ-backend.vercel.app/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
      body: JSON.stringify({
        receiveUser: otherUser,
        message: newMessage,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setNewMessage("");
          fetchMessages(otherUser);
        }
      });
  };

  const clickMessage = (otherUser) => {
    allMessages.map((data) => {
      for (let i = 0; i < data.messages.length; i++) {
        if (data.messages[i].send_user.username === otherUser) {
          setJustMessage(data.messages);
          setSendBtn(otherUser);
          console.log(data.messages[i].vu);
        } else if (data.messages[i].receive_user.username === otherUser) {
          setJustMessage(data.messages);
          setSendBtn(otherUser);
        }
      }
    })
  };

  

  function formatDate(timestamp) {
    const messageDate = new Date(timestamp);
    const now = new Date();

    const messageDay = messageDate.getDate();
    const messageMonth = messageDate.getMonth() + 1;
    const messageYear = messageDate.getFullYear();

    const nowDay = now.getDate();
    const nowMonth = now.getMonth() + 1;
    const nowYear = now.getFullYear();

    if (
      messageDay === nowDay &&
      messageMonth === nowMonth &&
      messageYear === nowYear
    ) {
      // Même jour, afficher l'heure et les minutes d'envoi du message
      const formattedTime = messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return formattedTime;
    } else if (
      messageDay === nowDay - 1 &&
      messageMonth === nowMonth &&
      messageYear === nowYear
    ) {
      // Jour précédent, afficher "Hier"
      return "Hier";
    } else {
      // Autre date, afficher la date complète (jj/mm/aaaa)
      const formattedDate = `${messageDay}/${messageMonth}/${messageYear}`;
      return formattedDate;
    }
  }

  const useMediaQuery = () => {
    const updateTarget = useCallback((e) => {
      if (e.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    }, []);

    useEffect(() => {
      const media = window.matchMedia(`(min-width: 768px)`);
      media.addEventListener("change", updateTarget);
      if (media.matches) {
        setTargetReached(true);
      }

      return () => media.removeEventListener("change", updateTarget);
    }, []);

    return targetReached;
  };

  useMediaQuery();

  const conversationsMenu = allMessages
    ?.sort((a, b) => {
      const dateA = new Date(a.messages[a.messages.length - 1].date);
      const dateB = new Date(b.messages[b.messages.length - 1].date);
      return dateB - dateA;
    })
    .map((data) => {
      const lastMessage = data.messages[data.messages.length - 1];

      if (lastMessage.send_user.username !== user.username) {
        const hasUnreadMessage =
          !lastMessage.vu &&
          lastMessage.receive_user.username === user.username;

        return (
          <li key={lastMessage.id}>
            <button
              onClick={() => {
                clickMessage(lastMessage.send_user.username);
                markAsRead(lastMessage.id);
              }}
            >
              {lastMessage.send_user.avatar ? (
                <Image
                  className="rounded-full"
                  src={lastMessage.send_user.avatar}
                  width={30}
                  height={30}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} size={30}/>
              )}
              {lastMessage.send_user.username}
              {hasUnreadMessage && (
                <sup className="bg-darkblue text-rouge rounded-full">new!</sup>
              )}
            </button>
          </li>
        );
      } else if (lastMessage.receive_user.username !== user.username) {
        return (
          <li key={lastMessage.id}>
            <button
              onClick={() => {clickMessage(lastMessage.receive_user.username)}}
            >
              {lastMessage.receive_user.avatar ? (
                <Image
                  className="rounded-full"
                  src={lastMessage.receive_user.avatar}
                  width={30}
                  height={30}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} size={25} width={30} height={30}/>
              )}
              {lastMessage.receive_user.username}
            </button>
          </li>
        );
      }
    });

  const messages = justMessage?.map((data, i) => {
    const formatedDate = formatDate(data.date);
    if (data.send_user.username === user.username) {
      return (
        <Messagerie
          isUser={true}
          username={data.send_user.username}
          message={data.message}
          avatar={data.send_user.avatar}
          date={formatedDate}
        />
      );
    } else if (data.send_user.username !== user.username) {
      return (
        <Messagerie
          isUser={false}
          senderUsername={data.send_user.username}
          message={data.message}
          avatar={data.send_user.avatar}
          date={formatedDate}
        />
      );
    }
  });

  return (
    <div className="h-full">
      <div className="my-10">
        <h3 className="text-center text-lightblue text-2xl font-montserrat font-semibold italic md:text-2xl lg:text-3xl">
          Messagerie
        </h3>
      </div>
      <div className="flex flex-col px-3 md:flex-row md:justify-center">
        {!targetReached ? (
          <div className="dropdown self-center mb-5">
            <label tabIndex={0} className="btn m-1 bg-lightblue border-none cursor-pointer focus:bg-darkblue">
              Messages
              {notification && (
                <sup className="bg-darkblue text-rouge rounded-full">new!</sup>
              )}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {conversationsMenu}
            </ul>
          </div>
          ) : (
          <div className="w-1/3 flex flex-col items-center">
            <h4 className="text-center text-darkblue mb-5 text-2xl font-montserrat font-semibold md:text-2xl lg:text-3xl">
              Tes Contacts
            </h4>
            <ul className="menu p-2 shadow bg-base-100 rounded-box w-52">
              {conversationsMenu}
            </ul>
          </div>
        )}
        <div className="md:w-2/3">
          {justMessage ? (
            <div>
              <h4 className="text-center text-darkblue mb-5 text-2xl font-montserrat font-semibold md:text-2xl lg:text-3xl">
                Messages de {sendBtn}
              </h4>
              <hr />
            </div>
          ) : (
            <div>
              <h4 className="text-center text-darkblue mb-5 text-2xl font-montserrat font-semibold md:text-2xl lg:text-3xl">
                Bienvenue sur ta messagerie
                <span className="text-rouge ml-1">{user.username}</span> !
              </h4>
              <p className="text-darkblue p-5 mb-5 text-base text-center font-montserrat font-medium md:text-lg lg:text-xl">
                {/* Text animation */}
                <TypeAnimation
                  style={{
                    whiteSpace: "pre-line",
                    height: "195px",
                    display: "block",
                  }}
                  sequence={[
                    `Sélectionne un contact pour consulter tes messages.\nTu n'en n'as pas encore ?
                    N'hésite pas à contacter un utilisateur via son profil !`, // actual line-break inside string literal also gets animated in new line, but ensure there are no leading spaces
                    1000,
                    "",
                  ]}
                  repeat={Infinity}
                />
              </p>
            </div>
          )}
          <div className="h-[30vh] overflow-y-auto" ref={conversationRef}  onLoad={() => {
          conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }}>{messages}</div>
        </div>
      </div>
      <hr />
      {justMessage && (
        <div className="flex flex-col items-center px-5 mt-5">
          <input
            className="input input-bordered input-warning w-full max-w-xs md:max-w-md resize-none leading-normal"
            type="textarea"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button
            className="py-2 px-4 w-48 text-base mt-3 mb-5 rounded-lg bg-lightblue text-white md:text-xl lg:text-2xl"
            onClick={() => sendMessage(sendBtn)}
          >
            Envoyer
          </button>
        </div>
      )}
    </div>
  );
}

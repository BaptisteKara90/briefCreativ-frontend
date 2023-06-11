import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

export function Messagerie(props) {
  const metaTitle ="Messagerie - mes contacts Brief Creativ'";

  if (props.isUser) {
    return (
      <div className="chat chat-end">
        <Helmet>
            <title>{metaTitle}</title>
        </Helmet> 
        <div className="chat-image avatar">
            {props.avatar ? (
              <Image
                className="rounded-full"
                src={props.avatar}
                width={35}
                height={35}
              />
            ) : (
              <FontAwesomeIcon className="text-center align-middle" icon={faUser} size={25} width={30} height={30}/>
            )}
        </div>
        <div className="chat-header">{props.username}</div>
        <div className="chat-bubble bg-lightblue">{props.message}</div>
        <time className="text-xs opacity-50">{props.date}</time>
      </div>
    );
  } else {
    return (
      <div className="chat chat-start">
        <div className="chat-image avatar">
            {props.avatar ? (
              <Image
                className="rounded-full"
                src={props.avatar}
                width={35}
                height={35}
              />
            ) : (
              <FontAwesomeIcon className="text-center align-middle" icon={faUser} size={25} width={35} height={35}/>
            )}
        </div>
        <div className="chat-header">{props.senderUsername}</div>
        <div className="chat-bubble bg-darkblue">{props.message}</div>
        <time className="text-xs opacity-50">{props.date}</time>
      </div>
    );
  }
}

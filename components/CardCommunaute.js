import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';

export default function CardCommunaute(props) {


//console.log('pros.liked :' ,props.liked)
//console.log('props.creationID:', props.creationId)

    return (
        <div className="flex flex-col justify-between drop-shadow rounded-lg bg-white mb-5 md:mx-3 ml-1">
            <Link href={`/briefuser/${props.creationId}`}>
                    <Image className="rounded-t-lg object-cover object-center cursor-pointer" src={props.img[0]} width='250' height='250' />
            </Link>
            <div className="flex flex-col justify-evenly p-6">
                <div className="flex justify-between">
                    <div>
                        <Link href={`/profil/${props.autor}`}>
                            <h3 className="mb-2 text-xl text-darkblue cursor-pointer font-montserrat font-bold hover:text-lightblue">{props.autor}</h3>
                        </Link>
                        <p className="mb-4 text-left text-lg text-darkblue font-montserrat capitalize">
                            {props.projectType}<br/>Style {props.styleType}</p>
                    </div>
                    <div className="flex items-center justify-end">
                        <p className="text-lg text-lightblue font-montserrat font-semibold cursor-pointer">
                            <FontAwesomeIcon
                                icon={faHeart}
                                className={props.liked ? "text-red-500" : "text-lightblue"}
                                onClick={props.onLike}
                                />
                            <span className="pl-2">{props.likeNumber}</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
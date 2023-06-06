import React, { useRef, useState, useEffect } from "react";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreationsAdd from './CreationsAdd';

export default function BriefsUserliste(props) { // page des Briefs de l'user // page privée


    const user = useSelector((state) => state.users.value);
    const typeProjet = props.data.projectType;
    const userId = props.user_id
    // useRef modal add Creation
    const [modalAddCreation, setModalAddCreation] = useState("modal-toggle");
    const [msgSuppImg, setMsgSuppImg] = useState('');
    //const [ description, setDescription ] = useState('');

    const setmodalAddCreationClose = (retour) => {
        if (retour) {
            setModalAddCreation("hidden"); // ferme la modal
            // màjr les img // reload la page
            window.location.replace("/briefs");
        }
    };
    const suppImg = (creationId, imgLink) => {
        const urlBackEnd = "http://localhost:3000";
        fetch(urlBackEnd + '/briefs/creations/suppimg', {
            method: 'DELETE',
            headers: {
                "Authorization": user.token, 'Content-Type': 'application/json'
            },
            body: JSON.stringify({ creationId, imgLink })
        })
            .then(response => response.json())
            .then(
                data => {
                    if (data.result) {
                        window.location.replace("/briefs"); // redirect to Briefs
                    } else {
                        setMsgSuppImg(<p className='text-rouge py-2'>Supp impossible</p>)
                    }
                }
            )
    }

    const couleurs = props.data.color.map(
        (data, k) => {
            return (
                <div className='' key={"colorat" + k}>
                    <div style={{ backgroundColor: data, height: 20, width: 30 }} className='md:pr-20 pr-16'></div>
                    <span className='text-sm'>{data}</span>
                </div>
            )
        }
    )

    //Make a creation private or not

    const togglePrivate = async () => {
        const url = `https://brief-creativ-backend.vercel.app/briefs/creations/${props.data.creations_id[0]._id}`;
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    "Authorization": user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ private: !props.data.creations_id[0].private })
            });

            if (response.ok) {

                window.location.reload();
            } else {

                console.error('Erreur lors de la modification de la création');
            }
        } catch (error) {
            console.error(error);
        }
    };


    let imagesListe = []
    let setDescription = ""
    let creationsListe=""
    

        if(props.data.creations_id.length > 0) {
            //idBrief = props.data._id
            props.data.creations_id.map( (dataImg, key) => {
                imagesListe=[]
                const IdCreation = dataImg._id;
                dataImg.images.map( (imgl, ki) => {
                    if(imgl) {
                            imagesListe.push(
                                <div className='mr-2' key={ "divimg"+IdCreation+ki}>
                                    <Image src={ imgl } alt={ ki } key={ "img"+ki} height="100" width="100" className="object-cover" />
                                    <label htmlFor={"modalsupp"+IdCreation+ki} className="cursor-pointer"><FontAwesomeIcon icon={faTrash}/></label>
                                    
                                    {/* *********** MODAL SUPP *********** */}
                                    <input type="checkbox" id={"modalsupp"+IdCreation+ki} className="modal-toggle" />
                                    <div className="modal">
                                        <div className="modal-box relative">
                                            
                                            <div className="flex flex-col justify-center items-center">
                                                {/*<p>IdCreation : {IdCreation}</p>*/}
                                                <h3 className='font-bold text-xl mb-5'><FontAwesomeIcon icon={faTrash} className='pr-1'/> Supprimer cette Image ?</h3>                                            
                                                <div className='my-5'>
                                                    <Image src={ imgl } alt={ "imgSupp"+ki } key={ "imgSupp"+ki} height="100" width="100" className="object-cover" />
                                                </div>
                                                <div>
                                                    {msgSuppImg}
                                                    <label onClick={ ()=> suppImg(IdCreation, imgl) }
                                                    className='cursor-pointer py-2 px-4 mr-4 text-base rounded-lg bg-lightblue text-white focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'>
                                                        Oui</label>
                                                    <label htmlFor={"modalsupp"+IdCreation+ki} 
                                                        className='cursor-pointer py-2 px-4 text-base rounded-lg bg-lightblue text-white focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'>Non</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>                       
                        )


                    }
                })
                setDescription = dataImg.description_autor;

                    {/* ************* LES CREATIONS **************** */}
                    creationsListe = 
                        <div>
                            {/*<p className="font-bold">Tes Créations - IdCrea : {IdCreation}/ IdBrief : {props.data._id}</p>*/}
                            <div>Description : { setDescription }</div>
                            <div className='flex flex-row flex-wrap my-2'>
                                {imagesListe}
                            </div>
                            <p className='my-5'>
                                <label htmlFor={ "my-modal"+IdCreation+key } className='mb-3 cursor-pointer py-1 px-2 text-base rounded-lg bg-lightblue text-white md:text-md lg:text-md focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'>
                                    <FontAwesomeIcon icon={faPlus} /> Images
                                </label>
                            </p>
                
                            <input type="checkbox" id={ "my-modal"+IdCreation+key } className={modalAddCreation} />
                            <div className="modal">
                                <div className="modal-box relative">
                                    <label htmlFor={ "my-modal"+IdCreation+key } className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                                    <CreationsAdd data={ props.data } user_id={ userId } description={setDescription} 
                                        creation_id={IdCreation} setmodalAddCreationClose= {setmodalAddCreationClose} />
                                </div>
                            </div>
                            
                            <div> {/* ************* PRIVE **************** */}
                                <button 
                                className='cursor-pointer py-2 px-4 text-base rounded-lg bg-lightblue text-white focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'
                                onClick={togglePrivate}>
                                {dataImg.private ? 'Rendre ma création publique' : 'Rendre ma création privée'}
                                </button>
                            </div>
                        </div>
            })
        } else {
            // si pas de creation //
            creationsListe = 
                <div>
                    <p className='my-5'>
                        <label htmlFor={"my-modal-add"+props.data._id} className='mb-3 cursor-pointer py-1 px-2 text-base rounded-lg bg-lightblue text-white md:text-md lg:text-md focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'>
                            <FontAwesomeIcon icon={faPlus} /> Création
                        </label>
                    </p>

                    <input type="checkbox" id={"my-modal-add"+props.data._id} className={modalAddCreation} />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor={"my-modal-add"+props.data._id} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <CreationsAdd data={ props.data } user_id={ userId } description="" 
                                creation_id="" setmodalAddCreationClose= {setmodalAddCreationClose} />
                        </div>
                    </div>
                </div>
        }
            
    const dateB = new Date(props.data.date)
    const jour = dateB.getDate() < 10 ? "0"+dateB.getDate() : dateB.getDate();
    const moisDate = dateB.getMonth()+1;
    const mois = moisDate < 10 ? "0"+moisDate : moisDate;
    const dateFr = jour+"/"+mois+"/"+dateB.getFullYear();

    return (
        <div className='py-5'>
            {/* <p>IdBrief : {props.data._id} ID OK</p> */}
            <h3><span className='uppercase font-extrabold'>{typeProjet}</span> pour {props.data.entrepriseName}</h3>
            <div>Style : {props.data.styleType}</div>
            <div>Couleurs : <div className='flex flex-row'>{ couleurs }</div></div>
            <div>Date d'ajout : {dateFr}</div>
            {creationsListe}

            <div>            
                <div className="collapse">
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title cursor-pointor hover:bg-or m-0 p-0">
                        <FontAwesomeIcon icon={faEye} className='cursor-pointor hover:bg-or active:bg-or' /> Brief
                    </div>
                    <div className="collapse-content m-0">
                        <p>{props.data.entrepriseSentence}</p>
                        <p>{props.data.projectSentence}</p>
                        <p>{props.data.styleSentence}</p>
                        <p className='text-or font-bold'>Délai : {props.data.delay}h</p>
                    </div>
                </div>
         
            </div>
        </div>
    )
}
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import BriefsUserliste from './BriefsUserListe';
import CreationsAdd from './CreationsAdd';

export default function BriefsUser() { // page des Briefs et créations de l'user // page privée
    
    const user = useSelector((state) => state.users.value);
    const [ creationsData, setCreationsData] = useState([]);
    const [ briefsUser, setBriefsUser] = useState([]);
    const [ userId, setUserId ] = useState(0);
    // useRef modal add Creation
    const [ modalAddCreation, setModalAddCreation] = useState("modal-toggle");

    const setmodalAddCreationClose = (retour) => {
        if (retour) setModalAddCreation("hidden"); // ferme la modal
    };

    if(!user.token) {
        window.location.replace('/'); // redirect to Home
    }

    // liste les briefs de user
    useEffect(() => {
        const urlBackEnd = "https://brief-creativ-backend.vercel.app";
        fetch(urlBackEnd+'/briefs/user/search/'+user.username)
        .then(response => response.json())
        .then(us => {
            console.log(us)
            if(us._id) {
                setUserId(us._id);

                const userId = us._id
                fetch(urlBackEnd+'/briefs/user/'+userId+'/briefs')
                .then(response => response.json())
                .then(data => { // briefs et creations de ce brief
                    if(data.result) {
                        setBriefsUser(data.briefs);
                    }
                    else {  }
                })
            }
            else {
                console.log("No User found");
            }
        })
        
    }, []);

/*
    useEffect(() => {
        fetch(`https://brief-creativ-backend.vercel.app/briefs/user/${user._id}/creations`)
        .then(response => response.json())
        .then(creation =>{
          setCreationsData(creation.creations)
        })
      },[user]);

        const creations = creationsData?.map((data, i) =>{
        return <CardCommunaute
        key={i}
        img={data.images}
        
        projectType={data.brief_id.projectType}
        entrepriseType={data.brief_id.entrepriseType}
        brief={data.brief_id}
        likeNumber={data.like?.length}
        creationId={data._id}
        />
      })
      */
    
    let BriefFinis = [];
    let BriefEnCours = [];
  
    briefsUser.map( // liste les briefs en cours et les briefs finis
        (data, ki) => {

            if(data.creations_id.length > 0) {

                BriefFinis.push(<BriefsUserliste data={data} fini={ true } key={ "bfini_"+ki } user_id={ userId }/>);
            } else {
                let k2= "k"+ki
                BriefEnCours.push(<BriefsUserliste data={data} fini={ false } key={ "bencours_"+ki } user_id={ userId } />);
            }
        }
    )
    let couleurs

    if(BriefEnCours[0] && BriefEnCours[0].props.data.color) {

        couleurs = BriefEnCours[0].props.data.color.map( // couleurs du dernier
            (col, k) => {
                return (
                    <div className='' key={ "color"+k}>
                        <div style={ { backgroundColor: col, height:50, width: 50 }} className='md:pr-20 pr-16 mr-2'></div>
                        <span className='text-sm'>{col}</span>
                    </div>
                )
            }
        )
    }



    return (
        <div className="">
          
            <h1 className="text-center text-darkblue text-5xl mb-20 mt-20 font-montserrat font-extrabold">Mes Briefs Créatifs</h1>

            <div>
                <div>
                    {BriefEnCours[0] ? (
                        <div className='flex flex-col md:flex-row justify-around items-stretch md:items-center mx-10 mb-10'>
                            <div className='px-5'>
                                <h2 className='font-extrabold text-3xl pb-5'>Dernier Brief</h2>
                                
                                 <h3><span className='uppercase font-extrabold text-or'>{BriefEnCours[0].props.data.projectType} </span> 
                                pour {BriefEnCours[0].props.data.entrepriseName}</h3>
                                <div className='font-extrabold'>Style : {BriefEnCours[0].props.data.styleType}</div>
                                <div>Couleurs : <div className='flex flex-row'>{ couleurs }</div></div>
                            </div>
                            <div className='px-5 md:mt-1 mt-5'>          
                                <div>
                                    <p className='mb-2'>{BriefEnCours[0].props.data.entrepriseSentence}</p>
                                    <p className='mb-2'>{BriefEnCours[0].props.data.projectSentence}</p>
                                    <p className='mb-2'>{BriefEnCours[0].props.data.styleSentence}</p>
                                    <p className='text-or font-bold'>Délai : {BriefEnCours[0].props.data.delay}h</p>
                                    <p className='mt-5'>
                                        <label htmlFor="my-modal" className='cursor-pointer py-2 px-4 text-base rounded-lg bg-lightblue text-white md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'>
                                            <FontAwesomeIcon icon={faPlus} size='2xs' />  Ajoute tes Créations
                                        </label>
                                    </p>
                                </div>
                                <input type="checkbox" id="my-modal" className="modal-toggle" />
                                <div className="modal">
                                    <div className="modal-box relative">
                                        <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                                        <CreationsAdd data={ BriefEnCours[0].props.data } user_id={ userId } 
                                            creation_id="" description=""  
                                            setmodalAddCreationClose= {setmodalAddCreationClose}  />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                        {/* <h2 className='font-extrabold text-2xl pb-5 text-or text-center mb-5'>Ton dernier Brief apparaitra ici</h2>
                            */}
                            </div>
                    ) }
                    
                </div>
                <div>

                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-stretch items-stretch'>
                <div className='bg-whitepink/40 text-darkblue mb-20 p-10 rounded-2xl mx-10 md:w-6/12'>
                    <h2 className='text-center text-darkblue text-3xl mb-10 font-montserrat font-extrabold'>Briefs en cours</h2>
                    <div className='divide-y'>
                        {BriefEnCours.length > 1 ? BriefEnCours.filter((e,i)=> i!== 0) : (<div>
                            <p className='text-or font-extrabold text-xl'>Pas de Brief en cours ?</p>
                            <p>Tu peux en générer un avec le générateur et l'enregistrer pour qu'il apparaisse ici.</p>
                            <p className='my-5 cursor-pointer'><Link href="/">
                                <span className='py-2 px-4 text-base rounded-lg bg-lightblue text-white md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'>
                               Générer&nbsp;un&nbsp;Brief </span>
                               </Link>
                            </p>
                        </div>) }
                    </div>
                </div>
                <div className='bg-whitepink/40 text-darkblue mb-20 p-10 rounded-2xl mx-10 md:w-6/12'>
                    <h2 className='text-center text-darkblue text-3xl mb-10 font-montserrat font-extrabold'>Briefs finis</h2>
                    <div className='divide-y'>
                        <div className="flex flex-wrap justify-center items-center">
                            {BriefFinis.length >= 1 ? BriefFinis : (<div>
                            <p className='text-or font-extrabold text-xl'>Pas de Brief finis ?</p>
                            <p>Ajoute des créations, elles aparaitront ici.</p>
                        </div>) }
                        </div>                       
                    </div>
                </div>
            </div>
        </div>
    );
}
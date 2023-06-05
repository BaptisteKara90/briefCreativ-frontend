import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Resizer from "react-image-file-resizer";

export default function CreationsAdd(props) {

    const [descriptionAutor, setDescriptionAutor] = useState(props.description);
    const [uploadImg, setUploadImg] = useState('');
    const [noimg, setNoimg] = useState('');
    const [ajoutok, setAjoutok] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    //console.log("Data Création ADD",props)
    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file, 800, 800, "JPEG", 100, 0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    const saveNewImg = async () => {
        const urlBackEnd = "http://localhost:3000";

        try {
            //console.log("Img upload"+uploadImg);
            if (uploadImg == '') {
                setNoimg(<p className='text-rouge py-2'>Tu dois ajouter une image.</p>)
            }
            else {
                const file = uploadImg;
                const imageResize = await resizeFile(file);
                const body = new FormData();

                const add = {
                    brief_id: props.data._id,
                    user_id: props.user_id,
                    creation_id: props.creation_id,
                    description_autor: descriptionAutor,
                    private : isPrivate
                }
                body.append('ids', JSON.stringify(add));
                body.append('photoFromFront', imageResize);

                fetch(urlBackEnd + '/briefs/creation', {
                    method: 'POST',
                    body,
                })
                    .then(response => response.json())
                    .then(retour => {
                        // return true ou false
                        // si true ferme la modal et majr page
                        console.log("Retour Add : ", retour);
                        if (retour.result) {
                            setAjoutok(<p className='text-lightblue py-2'>Ajout ok</p>)
                            //props.setmodalAddCreationClose(true);// fermer modal
                            // redirect pour recherger page
                            window.location.replace("/briefs"); // redirect to Briefs
                        } else {
                            setNoimg(<p className='text-rouge py-2'>Upload impossible</p>)
                        }
                    })
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
           {/* <p>IdBrief : {props.data._id} / IdCréation : {props.creation_id}</p> */}
            <h3 className='font-bold text-xl mb-5'>Ajoute tes Créations</h3>
            <div>
                {/* <p>idBrief : {props.data._id}</p> */}
                <label className="label">
                    <span className="label-text">Nouvelle image</span>
                </label>
                <input type="file" className="file-input w-full max-w-xs"
                    onChange={ e => setUploadImg(e.target.files[0]) } />
                    {noimg}
            </div>
            {/* Si edit creation */}
            {props.creation_id ==="" && (
                <div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea className="textarea textarea-bordered h-24"
                            value={descriptionAutor} onChange={e => setDescriptionAutor(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label className="label flex flex-row justify-start">
                            <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
                            <span className="label-text pl-2">Rendre privée ma création</span>
                        </label>
                    </div>
                </div>
            ) }
            <div className='mt-5'>
                <button onClick={ ()=> saveNewImg() }
                 className='cursor-pointer w-48 py-2 px-4 text-base rounded-lg bg-lightblue text-white focus:bg-lightblue active:bg-darkblue hover:bg-darkblue'>
                    <FontAwesomeIcon icon={faSave} className='pr-1'/> Ajouter</button>
                    {ajoutok}
            </div>
        </div>
    )
}
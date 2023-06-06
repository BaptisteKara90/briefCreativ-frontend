import { useState, useEffect } from "react";
import MenuBrief from "./MenuBrief";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEye } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function BriefGenerator() {
  const [data, setData] = useState("");
  const [colors, setColors] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const [selectedStyleType, setSelectedStyleType] = useState(null);
  const [modalregister, setModalregister] = useState("hidden");
  const [modalsavbrief, setModalsavbrief] = useState("hidden");
  const [briefregistre, setBriefregistre] = useState(false);
  const user = useSelector((state) => state.users.value);

  const handleProjectTypeChange = (value) => {
    setSelectedProjectType(value);
  };

  const handleBusinessTypeChange = (value) => {
    setSelectedBusinessType(value);
  };

  const handleStyleTypeChange = (value) => {
    setSelectedStyleType(value);
  };

  //bouton générer un brief
  const json_data = {
    mode: "random", // transformer, diffusion or random
    num_colors: 4, // max 12, min 2
    temperature: "1.2", // max 2.4, min 0
    num_results: 5, // max 50 for transformer, 5 for diffusion
    adjacency: [
      "0",
      "65",
      "45",
      "35",
      "65",
      "0",
      "35",
      "65",
      "45",
      "35",
      "0",
      "35",
      "35",
      "65",
      "35",
      "0",
    ], // nxn adjacency matrix as a flat array of strings
    palette: ["-", "-", "-", "-"], // locked colors as hex codes, or '-' if blank
  };
  const handleClick = () => {
    let url = `https://brief-creativ-backend.vercel.app/briefs/generateBrief`;
    const params = {
      projectTypeName: selectedProjectType,
      businessTypeName: selectedBusinessType,
      styleTypeName: selectedStyleType,
    };

    let query = Object.keys(params)
      .filter((key) => params[key] !== null)
      .map((key) => `${key}=${params[key].toLowerCase()}`)
      .join("&");

    if (query) {
      url = `${url}?${query}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.businessSentence = data.businessSentence.replace(
          "{businessName}",
          data.businessName
        );
        data.businessSentence = data.businessSentence.replace(
          "{businessTypeName}",
          data.businessType
        );
        data.businessSentence = data.businessSentence.replace(
          "{speciality}",
          data.speciality
        );
        data.projectSentence = data.projectSentence.replace(
          "{projectType}",
          data.projectType.name
        );
        data.styleSentence = data.styleSentence.replace(
          "{styleType}",
          data.styleType.name
        );
        setData(data);

        fetch(`https://api.huemint.com/color`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json_data),
        })
          .then((response) => response.json())
          .then((dataColors) => {

            setColors(dataColors.results[0].palette);
          });
      });
  };

  const closeModalRegister = () => {
    setModalregister("modal-close");
  };

  const saveClick = () => {
    if (!user.token) {
      setModalregister("modal-open");
    } else {
      const recBrief = {
        entrepriseName: data.businessName,
        entrepriseType: data.businessType,
        entrepriseSentence: data.businessSentence,
        speciality: data.speciality,
        projectType: data.projectType.name,
        projectSentence: data.projectSentence,
        styleType: data.styleType.name,
        styleSentence: data.styleSentence,
        color: colors,
        delay: data.delay,
      };
      fetch("https://brief-creativ-backend.vercel.app/briefs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify(recBrief),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            //setTimeOut(() => { setModalsavbrief("modal-open") }, 1000);
            setModalsavbrief("modal-open");
            /*setBriefregistre(true);
          window.location.replace("/briefs");*/ // redirect to Briefs
          }
        });
    }
  }; /*
  useEffect(() => {
    if(setBriefregistre) {
      setBriefregistre(false);
      window.location.replace("/briefs"); // redirect to Briefs
    }
  }, [briefregistre]); */

  const colorsData = colors?.map((dataC, i) => {
    return (
      <div key={i} className="my-5 mx-5 flex flex-col items-center">
        <div
          style={{ backgroundColor: `${dataC}`, width: "75px", height: "75px" }}
        ></div>
        <p className="">{dataC}</p>
      </div>
    );
  });

  return (
    <main>
      <div className=" flex flex-col lg:flex-row lg:justify-center pt-5">
        <MenuBrief
          onProjectTypeChange={handleProjectTypeChange}
          onBusinessTypeChange={handleBusinessTypeChange}
          onStyleTypeChange={handleStyleTypeChange}
        />

        <div className="flex flex-col rounded-xl justify-between border-1 border-or  drop-shadow-lg relative h-9/12 p-6 bg-white lg:ml-10 lg:w-9/12">
          {data ? (
            <div>
              <h3 className="text-darkblue text-lg font-montserrat font-extrabold mb-6 lg:text-4xl">
                Ton Nouveau Brief
              </h3>
              <p className="text-darkblue text-base lg:text-2xl">
                <span className="text-darkblue text-base font-medium lg:font-semibold lg:text-2xl">
                  {data.businessSentence}
                </span>
              </p>
              <div className="text-darkblue text-base mt-6 lg:text-2xl">
                <p className="text-darkblue text-base font-medium lg:font-semibold lg:text-2xl">
                  {data.projectSentence}
                </p>
                <p className="text-darkblue text-base mt-3 font-medium lg:font-semibold lg:text-2xl">
                  {data.styleSentence}
                </p>
                <p className="text-rouge text-base mt-3 font-semibold lg:text-2xl">
                  Penses-tu pouvoir relever le défi en {data.delay}h ?
                </p>
              </div>
              <div className="flex flex-col mt-10 lg:mt-20 md:flex-row md:justify-center">
                {colorsData}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-darkblue text-center text-2xl font-montserrat font-extrabold my-10 md:text-3xl lg:text-5xl">
                Génère ton Brief !
              </h3>
              <p className="text-darkblue text-center text-xl font-montserrat font-extrabold my-10 md:text-2xl lg:text-3xl">
                Bienvenue !
              </p>
              <p className="text-darkblue text-center text-base p font-montserrat md:text-xl lg:text-2xl">
                Tu as des options de générations si tu le souhaites,
              </p>
              <p className="text-darkblue text-center text-base font-montserrat mb-10 md:text-xl lg:text-2xl">
                sinon tu peux cliquer sur générer pour te faire un Brief
                complètement aléatoire !
              </p>
              <p className="text-or text-center text-xl font-montserrat font-extrabold md:text-2xl lg:text-4xl">
                Amuse toi Bien!
              </p>
            </div>
          )}
          <div className="flex justify-center items-center relative -bottom-10">
            <button
              className="py-2 px-4 w-48 text-base rounded-lg bg-lightblue text-white md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue"
              onClick={handleClick}
            >
              Générer
            </button>
            {data && (
              <button
                className="py-2 px-4 mx-2 w-48 text-base rounded-lg bg-darkblue text-white md:text-xl lg:text-2xl focus:bg-darkblue active:bg-lightblue hover:bg-lightblue"
                onClick={saveClick}
              >
                <FontAwesomeIcon icon={faSave} /> Enregistrer
              </button>
            )}
          </div>
        </div>
      </div>

      <input type="checkbox" id="modal-noregister" className="hidden" />
      <div className={"modal " + modalregister}>
        <div className="modal-box text-center">
          <h3 className="font-bold text-2xl">
            Tu souhaites enregistrer ce Brief ?
          </h3>
          <p className="py-4 text-or font-bold text-xl">
            Crée un compte gratuitement et rapidement.
          </p>
          <p className="py-4">
            Tu pourras alors ajouter toutes tes créations protégées par un watermark.
          </p>
          <button
            onClick={() => closeModalRegister()}
            className="cursor-pointer py-2 px-4 text-base rounded-lg bg-lightblue text-white md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue mr-5"
          >
            X
          </button>
          {/* 
          <label htmlFor="modal-noregister" className="btn capitalize cursor-pointer py-2 px-4 text-base rounded-lg bg-lightblue text-white md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue">Créer un compte</label>
          */}
        </div>
      </div>

      <input type="checkbox" id="modal-savbrief" className="hidden" />
      <div className={"modal " + modalsavbrief}>
        <div className="modal-box text-center">
          <h3 className="font-bold text-2xl mb-5">
            Ton Brief a été enregistré
          </h3>

          <Link href="/briefs">
            <span className="cursor-pointer py-2 px-4 text-base rounded-lg bg-lightblue text-white md:text-xl lg:text-2xl focus:bg-lightblue active:bg-darkblue hover:bg-darkblue my-10">
              <FontAwesomeIcon icon={faEye} /> Mes Briefs
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

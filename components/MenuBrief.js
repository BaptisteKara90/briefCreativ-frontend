import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBlender,  faTruckFast,  faPenToSquare,  faBoxesPacking,  faRankingStar,
  faCalendarDays,  faGem,  faUtensils,  faGlobe,  faCartShopping,faChevronDown,
  faIcons,  faPalette,  faDragon,  faCircleNodes,  faBoltLightning,  faLandmarkDome,
} from "@fortawesome/free-solid-svg-icons";

export default function Menus({ onProjectTypeChange, onBusinessTypeChange, onStyleTypeChange }) {

  
  
  const onChange = (e, onChangeFunc) => {
    onChangeFunc(e.target.value);
  };
  
  return (
    <div className="">
      <div className="collapse mb-5 collapse-arrow outline outline-offset-1 outline-1 outline-lightblue/40 rounded-lg">
        {/******************************* TYPE PROJET *****************************/}

        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-lightblue rounded-t-lg flex flex-row justify-between items-center pr-4">
          Type de projet{" "}
        </div>
        <div className="collapse-content text-black peer-checked:bg-white px-0">
          <ul>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tproj"
                  className="radio radio-accent peer/tproj radio-sm"
                  value="logo"
                  onChange={(e) => onChange(e, onProjectTypeChange)}
                />
                <span className="label-text peer-checked/tproj:text-lightblue">
                  <FontAwesomeIcon
                    icon={faIcons}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Logo
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tproj"
                  className="radio radio-accent peer/tproj radio-sm"
                  value="branding"
                  onChange={(e) => onChange(e,  onProjectTypeChange)}
                />
                <span className="label-text peer-checked/tproj:text-lightblue">
                  <FontAwesomeIcon
                    icon={faRankingStar}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Branding
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tproj"
                  className="radio radio-accent peer/tproj radio-sm"
                  value="illustration"
                  onChange={(e) => onChange(e,  onProjectTypeChange)}
                />
                <span className="label-text peer-checked/tproj:text-lightblue">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Illustration
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tproj"
                  className="radio radio-accent peer/tproj radio-sm"
                  value="packaging"
                  onChange={(e) => onChange(e,  onProjectTypeChange)}
                />
                <span className="label-text peer-checked/tproj:text-lightblue">
                  <FontAwesomeIcon
                    icon={faBoxesPacking}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Packaging
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tproj"
                  className="radio radio-accent peer/tproj radio-sm"
                  value=''
                  onChange={(e) => onChange(e,  onProjectTypeChange)}
                />
                <span className="label-text peer-checked/tproj:text-lightblue">
                  <FontAwesomeIcon
                    icon={faBlender}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Aléatoire
                </span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      {/****************** TYPE ENTREPRISE ********************/}
      <div className="collapse mb-5 collapse-arrow outline outline-offset-1 outline-1 outline-lightblue/40 rounded-lg">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-lightblue rounded-t-lg flex flex-row justify-between items-center pr-4">
          Type d'entreprise{" "}
        </div>
        <div className="collapse-content text-black peer-checked:bg-white px-0">
          <ul className="">
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpentp"
                  className="radio radio-accent peer/tpentp radio-sm"
                  value="tech"
                  onChange={(e) => onChange(e,  onBusinessTypeChange)}
                />
                <span className="label-text peer-checked/tpentp:text-lightblue">
                  <FontAwesomeIcon
                    icon={faGlobe}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Tech
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpentp"
                  className="radio radio-accent peer/tpentp radio-sm"
                  value="événementiel"
                  onChange={(e) => onChange(e, onBusinessTypeChange)}
                />
                <span className="label-text peer-checked/tpentp:text-lightblue">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Evénementiel
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpentp"
                  className="radio radio-accent peer/tpentp radio-sm"
                  value="restauration"
                  onChange={(e) => onChange(e, onBusinessTypeChange)}
                />
                <span className="label-text peer-checked/tpentp:text-lightblue">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Restauration
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpentp"
                  className="radio radio-accent peer/tpentp radio-sm"
                  value="luxe"
                  onChange={(e) => onChange(e, onBusinessTypeChange)}
                />
                <span className="label-text peer-checked/tpentp:text-lightblue">
                  <FontAwesomeIcon
                    icon={faGem}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Luxe
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpentp"
                  className="radio radio-accent peer/tpentp radio-sm"
                  value="grande distribution"
                  onChange={(e) => onChange(e, onBusinessTypeChange)}
                />
                <span className="label-text peer-checked/tpentp:text-lightblue">
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Grande distribution
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpentp"
                  className="radio radio-accent peer/tpentp radio-sm"
                  value="transports"
                  onChange={(e) => onChange(e, onBusinessTypeChange)}
                />
                <span className="label-text peer-checked/tpentp:text-lightblue">
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Transports
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpentp"
                  className="radio radio-accent peer/tpentp radio-sm"
                  value=''
                  onChange={(e) => onChange(e, onBusinessTypeChange)}
                />
                <span className="label-text peer-checked/tpentp:text-lightblue">
                  <FontAwesomeIcon
                    icon={faBlender}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Aléatoire
                </span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      {/****************** TYPE DE STYLE ********************/}
      <div className="collapse mb-5 collapse-arrow outline outline-offset-1 outline-1 outline-lightblue/40 rounded-lg">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-lightblue rounded-t-lg flex flex-row justify-between items-center pr-4">
          Type de style{" "}
        </div>
        <div className="collapse-content text-black peer-checked:bg-white px-0">
          <ul>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpstyl"
                  className="radio radio-accent peer/tpstyl radio-sm"
                  value="vintage"
                  onChange={(e) => onChange(e, onStyleTypeChange)}
                />
                <span className="label-text peer-checked/tpstyl:text-lightblue">
                  <FontAwesomeIcon
                    icon={faPalette}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Vintage
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpstyl"
                  className="radio radio-accent peer/tpstyl radio-sm"
                  value="contemporain"
                  onChange={(e) => onChange(e, onStyleTypeChange)}
                />
                <span className="label-text peer-checked/tpstyl:text-lightblue">
                  <FontAwesomeIcon
                    icon={faDragon}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Contemporain
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpstyl"
                  className="radio radio-accent peer/tpstyl radio-sm"
                  value="futuriste"
                  onChange={(e) => onChange(e, onStyleTypeChange)}
                />
                <span className="label-text peer-checked/tpstyl:text-lightblue">
                  <FontAwesomeIcon
                    icon={faBoltLightning}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Futuriste
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpstyl"
                  className="radio radio-accent peer/tpstyl radio-sm"
                  value="bauhaus"
                  onChange={(e) => onChange(e, onStyleTypeChange)}
                />
                <span className="label-text peer-checked/tpstyl:text-lightblue">
                  <FontAwesomeIcon
                    icon={faLandmarkDome}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Bauhaus
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpstyl"
                  className="radio radio-accent peer/tpstyl radio-sm"
                  value="flat Design"
                  onChange={(e) => onChange(e, onStyleTypeChange)}
                />
                <span className="label-text peer-checked/tpstyl:text-lightblue">
                  <FontAwesomeIcon
                    icon={faCircleNodes}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Flat Design
                </span>
              </label>
            </li>
            <li>
              <label className="label cursor-pointer flex-none justify-start">
                <input
                  type="radio"
                  name="tpstyl"
                  className="radio radio-accent peer/tpstyl radio-sm"
                  value=''
                  onChange={(e) => onChange(e, onStyleTypeChange)}
                />
                <span className="label-text peer-checked/tpstyl:text-lightblue">
                  <FontAwesomeIcon
                    icon={faCircleNodes}
                    size="xs"
                    className="px-2 text-xl md:text-xs"
                  />{" "}
                  Aléatoire
                </span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

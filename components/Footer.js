import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faLinkedinIn, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import ScrollToTop from "react-scroll-to-top";

export default function Footer() {
    
    return (
        <div className="bg-lightblue/10 text-darkblue">
          <div className='flex flex-row justify-between items-baseline p-4 container mx-auto '>
                <div className='text-center hidden md:block'>
                    <div className='font-bold mb-2'>A propos de nous :</div>
                    <ul>
                        <li>Qui sommes-nous ?</li>
                        <li>Nous contacter</li>
                        <li>Termes et conditions</li>
                        <li>Politique et confidentialité</li>
                    </ul>
                </div>
                <div className='text-center hidden md:block'>
                    <div className='font-bold mb-2'>Navigation : </div>
                    <ul>
                        <li>Plan du site</li>
                        <ScrollToTop smooth color="#000" />
                    </ul>
                </div>
                <div className='text-center hidden md:block'>
                    <div className='font-bold mb-2'>Actualités :</div>
                    <ul>
                        <li>Gagnants du concours de Design</li>
                        <li>Les derniers évènements</li>
                    </ul>
                </div>
                <div className='text-center mx-auto md:mx-0'>
                    <div className='font-bold mb-2 hidden md:block'>Nos réseaux</div>
                    <div className=''>
                        <FontAwesomeIcon icon={faFacebookF} size="xl" className='p-2 rounded-full text-darkblue mr-1' />
                        <FontAwesomeIcon icon={faInstagram} size="xl" className='p-2 rounded-full text-darkblue mr-1' />
                        <FontAwesomeIcon icon={faTwitter} size="xl" className='p-2 rounded-full text-darkblue mr-1' />
                        <FontAwesomeIcon icon={faLinkedinIn} size="xl" className='p-2 rounded-full text-darkblue mr-1' />
                    </div>
                </div>
            </div>
        </div>
    );
}
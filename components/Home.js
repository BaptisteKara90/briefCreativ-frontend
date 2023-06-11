import CarouselHome from './CarouselHome';
import BriefGenerator from './Briefgenerator';
import { Helmet } from "react-helmet";

function Home() {
  const metaTitle ="Brief Créativ' - Générateur de Briefs créatifs";
  const metaDescription = "Pour les graphiste amateur ou confirmés venaient découvrir notre générateur de Briefs. Pour créer des logo, des branding, suivant un type d'entreprise et des couleurs aléatoires.";

  return (
    <div className='font-montserrat'>
      <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription}/>
      </Helmet> 
        <div className='bg-whitepink/40 -mt-10 p-10 mb-20'>
          <BriefGenerator/>
        </div>
        <CarouselHome />
    </div>
  );
}

export default Home;

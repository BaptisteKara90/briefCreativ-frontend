import CarouselHome from './CarouselHome';
import BriefGenerator from './Briefgenerator';

function Home() {

  return (
    <div className='font-montserrat'>
        <div className='bg-whitepink/40 -mt-10 p-10 mb-20'>
          <BriefGenerator/>
        </div>
        <CarouselHome />
    </div>
  );
}

export default Home;

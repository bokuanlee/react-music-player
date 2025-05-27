import { useState } from 'react';

// components
import Search from '../Search/Search';

// types
import { IArtist } from '../../types/types';

// interfaces
interface IProps {
  artist: IArtist;
}

const Header: React.FC<IProps> = ({ artist }) => {
  const [follow, setFollow] = useState<boolean>(false);

  /**
   * Toggles the follow state for the artist.
   */
  const handleFollow = () => {
    setFollow(!follow);
  };

  return (
    <section
      style={{ backgroundImage: `url(${artist.image})` }}
      className='artist-cover flex flex-column flex-h-end'
    >
      <div className='artist-gradient'>
        <div className='container'>
          <h1 className='text-shadow'>MindSync Music!</h1>
          <p className='text-shadow'>Welcome to our innovative music player! We detect your EEG data to analyze your mental state, dynamically selecting the perfect music to match—relaxing tunes for calmness, focused beats for concentration, intense tracks for stress relief, or nostalgic melodies for memory. Experience a personalized audio journey tailored to your mind.</p>
        </div>
      </div>
    </section>
  );
};

export default Header;

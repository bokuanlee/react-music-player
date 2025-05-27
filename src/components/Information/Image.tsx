import { useState } from 'react';

import { Link } from 'react-router-dom';

// types
import type { IAlbum } from '../../types/types';

// interfaces
interface IProps {
  album: IAlbum;
}

const Image: React.FC<IProps> = ({ album }) => {
  const [follow, setFollow] = useState<boolean>(false);

  /**
   * Toggles the follow state for the artist.
   */
  const handleFollow = () => {
    setFollow(!follow);
  };

  return (
    <section className='image'>
      <div className='image-inner'>
        <div className='front'>
          <img src={album.image} alt={album.name} draggable='false' />
        </div>
        <div
          className='back flex flex-h-center flex-v-end'
          style={{ backgroundImage: `url('${album.artist.image}')` }}
        >
          <div className='back-info'>
            <h3>{album.artist.name}</h3>
            <p>{album.artist.description}</p>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Image;

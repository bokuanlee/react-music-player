// components
import Player from './components/Player/Player';

// styles
import './styles/player.css';

// navigation
import Navigation from './navigation/Navigation';

// providers
import TrackProvider from './providers/TrackProvider';

import albumsData from './data/albumData.json'; // Import your albums data

const App: React.FC = () => (
  <TrackProvider albums={albumsData}>
    <Player />
    <Navigation />
  </TrackProvider>
);

export default App;

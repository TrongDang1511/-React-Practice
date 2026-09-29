import MoviePlaylist from './components/MoviePlaylist';
import SongPlaylist from './components/SongPlaylist';

export default function App() {
    const handleResetClick = () => {
        // To Do:
        // Reset state
    };

    return (
        <div className="container is-fluid">
            <button onClick={() => handleResetClick()} className="button is-danger">
                Reset Both Playlists
            </button>
            <hr />
            <MoviePlaylist />
            <hr />
            <SongPlaylist />
        </div>
    );
}

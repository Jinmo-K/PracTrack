import io from 'socket.io-client';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://practrack.herokuapp.com/';

// Socket IO client instance
export default io(url);
import React from 'react';
import { useNavigate } from 'react-router-dom';

function App () {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/listings');
  }, [navigate]);

  return (
    <>Let&apos;s go!</>
  );
}

export default App;

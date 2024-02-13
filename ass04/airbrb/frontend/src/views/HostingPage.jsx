import * as React from 'react';
import AuthContext from '../context/AuthContext';
// import { postRequest } from '../../utils/request';
import { useNavigate, useLocation } from 'react-router-dom';
import { HostingNavbar } from '../components/Navbar/HostingNavbar';
import { HostingHome } from '../components/HostingComponents/HostingHome';
import { HostingInbox } from '../components/HostingComponents/HostingInbox';
import { HostingHistory } from '../components/HostingComponents/HostingHistory';
export const HostingPage = () => {
  const { user } = React.useContext(AuthContext);
  const [currentSelectedComponent, setCurrentSelectedComponent] = React.useState(null);
  const [listingId, setListingId] = React.useState(null);
  const changeComponent = (data) => {
    console.log(data);
    setCurrentSelectedComponent(data);
  }
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    if (!user) {
      navigate('/listings/login');
      return;
    }
    console.log(currentSelectedComponent);
    const path = location.pathname;
    if (path === '/hosting' && (!currentSelectedComponent || currentSelectedComponent === 'history')) setCurrentSelectedComponent('home');
    else if (path.startsWith('/hosting/listing/history/')) {
      const listingId = parseInt(path.split('/hosting/listing/history/')[1]);
      setListingId(listingId);
      setCurrentSelectedComponent('history');
    }
  }, [user, currentSelectedComponent, location, location.pathname]);
  if (!currentSelectedComponent) return <div>Loading...</div>
  return (
    <div>
        <HostingNavbar selectComponent={changeComponent}/>
        {currentSelectedComponent === 'home' && <HostingHome/>}
        {currentSelectedComponent === 'inbox' && <HostingInbox/>}
        {currentSelectedComponent === 'history' && <HostingHistory listingId={listingId}/> }
    </div>
  );
}

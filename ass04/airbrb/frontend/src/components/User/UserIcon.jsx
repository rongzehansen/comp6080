import AuthContext from '../../context/AuthContext';
import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';

export const UserIcon = ({ onClick }) => {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(user);
  useEffect(() => {
    if (user !== currentUser) setCurrentUser(user);
  }, [user]);
  console.log(currentUser);

  function stringToColor (string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) hash = string.charCodeAt(i) + ((hash << 5) - hash);
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar (name) {
    const initials = name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0];
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initials,
    };
  }

  return (<div onClick={onClick}>
    {currentUser && <Avatar {...stringAvatar(currentUser.userId)} />}
    {!currentUser && <Avatar src="/broken-image.jpg" />}
    </div>);
}

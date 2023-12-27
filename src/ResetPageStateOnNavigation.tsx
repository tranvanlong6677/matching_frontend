import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPageStateOnNavigation = () => {
  const [routeKey, setRouteKey] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a new key for each location change
    setRouteKey(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    // Clear the state when navigating
    setRouteKey('');
  }, [navigate]);

  return <div key={routeKey}>{/* Render your components here */}</div>;
};

export default ResetPageStateOnNavigation;

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMap,
  faMapLocationDot,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';

import '../styles/navigatorbar-style.css';

function Navigatorbar() {
  const navigate = useNavigate();
  return (
    <div className="navigatorbar">
      <FontAwesomeIcon
        className="font-icon"
        icon={faMap}
        onClick={() => navigate('/review')}
      />
      <FontAwesomeIcon
        className="font-icon"
        icon={faMapLocationDot}
        onClick={() => navigate('/')}
      />
      <FontAwesomeIcon
        className="font-icon"
        icon={faPencil}
        onClick={() => navigate('/reviewwrite')}
      />
    </div>
  );
}

export default Navigatorbar;

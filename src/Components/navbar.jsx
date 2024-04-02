import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toolbarImage from '../Images/Vanderbilt_University_seal.svg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './navbar.css'; // This is the CSS file for the navbar
import { useAuth } from '../Contexts/AuthContext'; // Import useAuth

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const navigate = useNavigate();
    const {authUser,setAuthUser,isLoggedIn,setIsLoggedIn} = useAuth(); // Use the useAuth hook to get the isLoggedIn state

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', showButton);

        // Cleanup the component
        return () => {
            window.removeEventListener('resize', showButton);
        };
    }, []);

    useEffect(() => {
        showButton();
    }, []);

    const redirectToMenus = () => {
        window.open('http://vu.edu/menus', '_blank').focus();
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleProfileClick = () => {
        if (isLoggedIn) {
            navigate('/profile-info');
        }else{
            navigate('/profile');
        }
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleLogoutClick = () => {
        setIsLoggedIn(false); // Update the isLoggedIn state to false
        navigate('/'); // Navigate the user back to the homepage
    };

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to="/" className="navbar-logo">
                    <img src={toolbarImage} alt="Logo" className="navbar-logo-img" />
                </Link>
                <div className='menu-icon' onClick={() => setClick(!click)}>
                    <FontAwesomeIcon icon={click ? faTimes : faBars} />
                </div>
                <button 
                    className="btn btn--primary btn-m" 
                    onClick={redirectToMenus}
                >
                    View Menus
                </button>
                {isLoggedIn && ( // Conditionally render these buttons if isLoggedIn is true
                    <>
                        <button
                            className="btn btn--primary btn-m" 
                            onClick={handleDashboardClick}
                        >
                            My Dashboard
                        </button>
                        <button
                            className="btn btn--primary btn-m" 
                            onClick={handleProfileClick}
                        >
                            Profile
                        </button>
                        <button
                            className="btn btn--primary btn-m"
                            onClick={handleLogoutClick}
                        >
                            Log Out
                        </button>
                    </>
                )}
                {!isLoggedIn && ( // Only show the login button if isLoggedIn is false
                    <button 
                        className="btn btn--primary btn-m" 
                        onClick={handleLoginClick}
                    >
                        Log In
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

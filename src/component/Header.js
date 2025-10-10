import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Logo from './images/Logo.png';

export default function Header() {
  const { formatMessage } = useIntl();

  return (
    <header className="header">
      <img className="logo" src={Logo} alt="Logo" />

      <nav className="navbar">
        <Link className="link" to="/">
          {formatMessage({ id: 'home', defaultMessage: 'Home' })}
        </Link>
        <Link className="link" to="/contact">
          {formatMessage({ id: 'contact', defaultMessage: 'Contact' })}
        </Link>
      </nav>
    </header>
  );
}

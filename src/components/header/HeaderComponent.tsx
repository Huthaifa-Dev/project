import { Button } from "../utils/Button/Button";
import image from "../../assets/image/pos.svg";
import "./header.scss";
import { User } from "../../types";
import { Link } from "react-router-dom";
import PosPhoto from "../../assets/image/credit_card.svg";
import CatPhoto from "../../assets/image/category.svg";
import ProPhoto from "../../assets/image/product.svg";
interface HeaderProps {
  user?: Partial<User>;
  onLogin: () => void;
  onLogout: () => void;
}

const HeaderComponent = ({ user, onLogin, onLogout }: HeaderProps) => {
  return (
    <header>
      <div className="wrapper">
        <div className="header">
          <Link className="header-logo" to="/">
            <img alt="logo" src={image} />
            <h1>POS Store</h1>
          </Link>
          <Link to="/" className="header-link">
            <Button>
              <img alt="Credit" src={PosPhoto} />
              POS
            </Button>
          </Link>
          <Link to="/categories" className="header-link">
            <Button>
              <img alt="CatPhoto" src={CatPhoto} />
              Categories
            </Button>
          </Link>
          <Link to="/product" className="header-link">
            <Button>
              <img alt="ProPhoto" src={ProPhoto} />
              Products
            </Button>
          </Link>
        </div>
        <div>
          {user ? (
            <>
              <span className="welcome">
                Welcome, <b>{user?.username}</b>!
              </span>
              <Button size="small" onClick={onLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button size="small" primary onClick={onLogin}>
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default HeaderComponent;

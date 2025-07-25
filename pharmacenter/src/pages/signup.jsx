import SignupComp from '../components/signupcomp';
import FondoSignup from '../assets/FondoSignup.webp';
import '../styles/signup.css';

const Signup = () => {
  return (
    <div 
      className="signup-page"
      style={{
        backgroundImage: `url(${FondoSignup})`,
      }}
    >
      <div className="signup-overlay">
        <SignupComp />
      </div>
    </div>
  );
};

export default Signup;
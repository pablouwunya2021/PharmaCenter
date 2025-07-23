import SignupComp from '../components/signupcomp';
import FondoSignup from '../assets/FondoSignup.webp';

const Signup = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${FondoSignup})`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-30 backdrop-blur-sm">
        <SignupComp />
      </div>
    </div>
  );
};

export default Signup;
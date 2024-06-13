// import logo from './logo.svg';
// import SignUp from './pages/auth/SignUp';
import RoutesContainer from "./routes/Routes";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <ScrollToTop>
      <RoutesContainer />
    </ScrollToTop>
  );
}

export default App;

import './App.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container'
import { Route, Switch } from 'react-router-dom'
import SignInForm from './pages/auth/SignInForm';
import SignUpForm from './pages/auth/SignUpForm';
import HeroArea from './components/HeroArea';

function App() {
  return (
    <div className="App">

      <Container className="p-0">
        <NavBar />
        <Switch>
          <Route exact path="/" render={() => <HeroArea />} />
          <Route exact path="/hacks" render={() => <h1>Hacks</h1>} />
          <Route exact path="/sign-in" render={() => <SignInForm />} />
          <Route exact path="/sign-up" render={() => <SignUpForm />} />
          <Route render={() => <h1>Page not found!</h1>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;

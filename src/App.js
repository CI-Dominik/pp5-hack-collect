import './App.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container'
import { Route, Switch } from 'react-router-dom'
import SignInForm from './pages/auth/SignInForm';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Container>
        <Switch>
          <Route exact path="/" render={() => <h1>Starting page</h1>} />
          <Route exact path="/hacks" render={() => <h1>Hacks</h1>} />
          <Route exact path="/sign-in" render={() => <SignInForm />} />
          <Route render={() => <h1>Page not found!</h1>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;

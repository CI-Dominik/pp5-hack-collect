import './App.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container'
import { Route, Switch, Redirect } from 'react-router-dom'
import SignInForm from './pages/auth/SignInForm';
import SignUpForm from './pages/auth/SignUpForm';
import HackList from './pages/hacks/HackList';
import CreateHack from './pages/hacks/CreateHack';
import HackPage from './pages/hacks/HackPage';
import HackEdit from './pages/hacks/HackEdit';
import { useCurrentUser } from './contexts/CurrentUserContext';
import CategoryManager from './pages/categories/CategoryManager';
import ProfilePage from './pages/profiles/ProfilePage';
import ProfileEditForm from './pages/profiles/ProfileEditForm';
import UserPasswordForm from './pages/profiles/UserPasswordForm';
import UsernameForm from './pages/profiles/UsernameForm';
import HomePage from './components/HomePage';
import Footer from './components/Footer';

function App() {

  // Get current user and profile ID

  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  // Get admin status

  const isAdmin = currentUser?.is_staff;

  return (
    <div className="App">
      <Container className="p-0">
        <NavBar />
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route exact path="/hacks" render={() => <HackList />} />
          <Route exact path="/hacks/:id" render={() => <HackPage />} />
          <Route exact path="/hacks/:id/edit" render={() => <HackEdit />} />
          <Route exact path="/add-hack" render={() => <CreateHack />} />
          <Route exact path="/sign-in" render={() => <SignInForm />} />
          <Route exact path="/sign-up" render={() => <SignUpForm />} />
          <Route exact path="/rated" render={() => <HackList filter={`ratings__owner__profile=${profile_id}&`} />} />
          <Route exact path="/followed" render={() => <HackList filter={`owner__followed__owner__profile=${profile_id}&`} />} />
          {/* Category Manager only for admins */}
          <Route
            exact
            path="/category-manager"
            render={() =>
              isAdmin ? <CategoryManager /> : <Redirect to="/" />
            }
          />
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          {/* Rendering when no page was found */}
          <Route render={() => <h1>Page not found!</h1>} />
        </Switch>
        <Footer />
      </Container>
    </div>
  );
}

export default App;

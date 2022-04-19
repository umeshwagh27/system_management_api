import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProfilePage from './pages/ProfilePage';
import SingIn from './pages/SingIn';
import StartingPageContent from './components/StartingPage/StartingPageContent';
import Car from './components/Car/Car';
import AuthContext from './tokenStore/auth-context';
import SingUp from './pages/SingUp';
import Model from './components/Car/Model';
import SubModel from './components/Car/SubModel';
import Image from './components/Car/Image';
import UserList from './components/User/UserList';
function App() {
  const authCtx = useContext(AuthContext);  

  return (
    <Layout>
      <Switch>
      {authCtx.isLoggedIn && authCtx.isAdmin && (
        <Route path='/startingPage/StartingPage' >
          <StartingPageContent />
        </Route>
       )}
        {!authCtx.isLoggedIn && (
          <Route path='/user/Login'>
            <SingIn />
          </Route>
        )}
       {!authCtx.isLoggedIn && (
          <Route path='/user/Register'>
            <SingUp />
          </Route>
        )}
        {authCtx.isLoggedIn &&  (

        <Route path='/user/Profile'>
          <ProfilePage />          
        </Route>
        )}
        {authCtx.isLoggedIn && authCtx.isAdmin && (
          <Route path='/user/UserList'>
            <UserList />          
          </Route>
       )}
        {authCtx.isLoggedIn && authCtx.isAdmin && (
      
          <Route path='/car/Car'>
            <Car />          
          </Route>
        )}
        {authCtx.isLoggedIn && authCtx.isAdmin && (
          <Route path='/car/Model'>
            <Model />          
          </Route>
       )}
        {authCtx.isLoggedIn && authCtx.isAdmin && (
          <Route path='/car/SubModel'>
            <SubModel />          
          </Route>
       )}
      {authCtx.isLoggedIn && authCtx.isAdmin && (
          <Route path='/car/Image'>
            <Image />          
          </Route>
       )}
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}
export default App;

// src/user/app.js
import { Route, Routes} from 'react-router-dom';
import userRoutes from'../Shared/routes/userRoutes'
import Layout from './components/layout/layout';

function UserRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {userRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}

export default UserRoutes;

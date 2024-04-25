import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import MainLayout from './components/MainLayout';
import Post from './pages/Post';
import DetailPost from './pages/DetailPost';
import AddPostPage from './pages/AddPostPage';
import EditPostPage from './pages/EditPostPage';
import ForecastPage from './pages/ForecastPage';

const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
    loader: () => {
      let token = localStorage.getItem('token');
      if (token) {
        return redirect('/');
      }
      return null;
    },
  },
  {
    path: '/login',
    element: <Login />,
    loader: () => {
      let token = localStorage.getItem('token');
      if (token) {
        return redirect('/');
      }
      return null;
    },
  },
  {
    element: <MainLayout />,
    loader: () => {
      let token = localStorage.getItem('token');
      if (!token) {
        return redirect('/login');
      }
      return null;
    },
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/post',
        element: <Post />,
      },
      {
        path: '/post/add-page',
        element: <AddPostPage />,
      },
      {
        path: '/post/edit/:id',
        element: <EditPostPage />,
      },
      {
        path: '/post/:id',
        element: <DetailPost />,
      },
      {
        path: '/forecast',
        element: <ForecastPage />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;

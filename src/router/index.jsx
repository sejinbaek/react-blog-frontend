import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../common/DefaultLayout'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { CreatePost } from '../pages/CreatePost'
import { FullScreenLayout } from '../common/FullScreenLayout'
import { PostListPage } from '../pages/PostListPage'
import { PostDetailPage } from '../pages/PostDetailPage'
import { EditPost } from '../pages/EditPost'
import { UserPage } from '../pages/UserPage'
import { UserInfoUpdate } from '../pages/UserInfoUpdate'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        index: true,
        element: <PostListPage />,
      },
      {
        path: '/createPost',
        element: <CreatePost />,
      },
      {
        path: '/post/:postId',
        element: <PostDetailPage />,
      },
      {
        path: '/edit/:postId',
        element: <EditPost />,
      },
      {
        path: '/users/:username',
        element: <UserPage />,
      },
      {
        path: '/update-profile',
        element: <UserInfoUpdate />,
      },
    ],
  },
  {
    path: '/register',
    element: (
      <FullScreenLayout>
        <RegisterPage />
      </FullScreenLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <FullScreenLayout>
        <LoginPage />
      </FullScreenLayout>
    ),
  },
  {
    path: '*',
    element: <div>페이지를 찾을 수 없습니다</div>,
  },
])

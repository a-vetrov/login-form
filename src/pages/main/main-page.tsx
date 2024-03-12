import React from 'react'
import { Link } from 'react-router-dom'
import { userInfoSelector } from '../../store/selectors/user-info.ts'
import { useSelector } from 'react-redux'
import { MainToolbar } from '../../components/main-toolbar'

export const MainPage: React.FC = () => {
  const userInfo = useSelector(userInfoSelector)

  return (
    <>
      <MainToolbar />
        <h1>Main page</h1>
        <ul>
          {
            userInfo !== null
              ? (
                  <li>
                    <Link to='/logout'>Logout</Link>
                  </li>
                )
              : (
                  <>
                    <li>
                      <Link to='/login'>Login</Link>
                    </li>
                    <li>
                      <Link to='/register'>Register</Link>
                    </li>
                  </>
                )
          }
        </ul>
    </>
  )
}

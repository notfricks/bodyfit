import Link from 'next/link'
import Image from 'next/image'
import {
  FaBars,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaUser,
  FaHome,
} from 'react-icons/fa'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Navbar({ children }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState({})

  useEffect(() => {
    if (!session) return
    async function getUser() {
      const user = await fetch(`/api/user/${session.user.id}`, {
        method: 'GET',
      })
      const res = await user.json()
      if (res) setUser(res)
    }
    getUser()
  }, [session])

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-1 px-2 mx-2 h-full">
            <div className="h-full w-32 relative">
              <Link href="/dashboard">
                <Image src="/logo.png" alt="Bodyfit" fill />
              </Link>
            </div>
          </div>
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <FaBars />
            </label>
          </div>
        </div>
        <div className="flex justify-center items-center flex-grow">
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 justify-between">
          <div>
            <div className="p-4">
              <p>Olá{user?.name ? `, ${user.name}` : ''}!</p>
            </div>
            <div className="divider"></div>
            <li key="home">
              <a onClick={() => router.push('/dashboard/')}>
                <FaHome />
                Página inicial
              </a>
            </li>
            <li key="profile">
              <a onClick={() => router.push('/dashboard/profile')}>
                <FaUser />
                Perfil
              </a>
            </li>
            <li key="config">
              <a>
                <FaCog />
                Configurações
              </a>
            </li>
            {user?.role == 'ADMIN' && (
              <li key="admin">
                <a onClick={() => router.push('/dashboard/admin')}>
                  <FaShieldAlt />
                  Painel de administrador
                </a>
              </li>
            )}
          </div>
          <div>
            <div className="divider"></div>
            <li key="exit">
              <a onClick={() => signOut({ callbackUrl: '/' })}>
                <FaSignOutAlt /> Sair
              </a>
            </li>
          </div>
        </ul>
      </div>
    </div>
  )
}

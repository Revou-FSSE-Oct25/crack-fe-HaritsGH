import Link from "next/link"

const Header : React.FC = () => {
  return (
    <div className="flex justify-between px-3 border-b-1">
      <Link href={'/'}>
        <h1>Webset Turni</h1>
      </Link>
      <div className="">
        <Link href={'/login'}>Login</Link>
        <div className="">
          <p>If Logged in</p>
          <p>Hi, User</p>
          <p>Profile Pic</p>
          {/* kalo foto profil nya dipencet, ntar muncul menu dropdown yg isinya menu buat: ke Dashboard, ke Account Info, Logout */}
        </div>
      </div>
    </div>
  )
}

export default Header

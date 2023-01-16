import Link from "next/link"
import { PageHeader, Space } from "antd"

const Nav = () => {
  return (
    <div className="header">
      <PageHeader
        ghost={false}
        avatar={{
          src: "/assets/logo.png",
        }}
        title={
          <Link href="/" className="heading">
            Novelbits
          </Link>
        }
        subTitle="Generate artwork through AI, secure it as NFT"
        extra={
          <>
            <div className="header-list">
              <Link className="nav-child" href="/collections">
                Collections
              </Link>
              <Link className="nav-child" href="/create">
                Create
              </Link>
            </div>
          </>
        }
      />
    </div>
  )
}

export default Nav

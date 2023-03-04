import Link from "next/link"
import { Button, PageHeader } from "antd"
import {
  changeNetwork,
  checkIfWalletIsConnected,
  connectWallet,
  useAccountContext,
} from "../context/accountContext"
import { useEffect } from "react"
import { formatAccount } from "@/utils/common"

const Nav = () => {
  const [accountState, accountDispatch] = useAccountContext()
  let buttonText

  if (accountState.metamaskNotFound) {
    buttonText = "Please install metamask"
  } else if (accountState.isAppDisabled) {
    buttonText = "Switch Network"
  } else {
    buttonText = "Connect Wallet"
  }

  useEffect(() => {
    checkIfWalletIsConnected(accountDispatch)
  }, [])

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
            <Button
              loading={accountState.isLoading}
              type="primary"
              onClick={() =>
                accountState.isAppDisabled
                  ? changeNetwork()
                  : connectWallet(accountDispatch)
              }
              disabled={
                !!accountState?.account || accountState.metamaskNotFound
              }
            >
              {accountState.account
                ? `${formatAccount(accountState?.account.address)} | ${
                    accountState?.account.balance
                  }`
                : buttonText}
              {/* <img className={"its-eth-babe"} src={ethLogo} alt="button" /> */}
            </Button>
          </>
        }
      />
    </div>
  )
}

export default Nav

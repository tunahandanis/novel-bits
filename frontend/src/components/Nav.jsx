import Link from "next/link"
import { Button, PageHeader } from "antd"
import { useAccountContext } from "../context/accountContext"
import { useEffect } from "react"
import { formatAccount } from "@/utils/common"
import { ethers } from "ethers"

const Nav = () => {
  const {
    accountState,
    accountDispatch,
    checkIfWalletIsConnected,
    changeNetwork,
    connectWallet,
  } = useAccountContext()
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

  const makeTransfer = async () => {
    const params = {
      nonce: "0x00",
      to: "0xFB068ef1410bcF8903490aF4Beea6129C3AE8AAB",
      from: accountState.account.address,
      value: ethers.utils.parseUnits("1", 18).toString(),
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    console.log(params)

    await signer.sendTransaction(params)
  }
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
                  } FTM`
                : buttonText}
            </Button>
            <Button type="primary" onClick={makeTransfer}>
              Transfer
            </Button>
          </>
        }
      />
    </div>
  )
}

export default Nav

import { useAccountContext } from "@/context/accountContext"
import { Button, Collapse, Tooltip } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { LockOutlined } from "@ant-design/icons"
import { ethers } from "ethers"
import BookAccessNFT from "../../../artifacts/contracts/BookAccessNFT.sol/BookAccessNFT.json"
import { contractAddress } from "@/utils/constants"

const Book = () => {
  const router = useRouter()
  const [book, setBook] = useState()
  const [hasAccess, setHasAccess] = useState(false)

  const { checkIfWalletIsConnected, accountDispatch, accountState } =
    useAccountContext()

  const buyAccess = async () => {
    const params = {
      nonce: "0x00",
      to: book.authorWalletAddress,
      from: accountState.account.address,
      value: ethers.utils.parseUnits(book.premiumPrice, 18).toString(),
      gasPrice: ethers.utils.parseUnits("2.0", "gwei").toHexString(),
    }

    console.log(params)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    try {
      await signer.sendTransaction(params)
      await mintAccessNFT()
      await getAccessedBooksByAddress()
    } catch (error) {
      console.error(error)
    }
  }

  const getAccessedBooksByAddress = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const contract = new ethers.Contract(
      contractAddress,
      BookAccessNFT.abi,
      provider
    )

    try {
      const books = await contract.getAccessedBooks(
        accountState.account.address
      )
      setHasAccess(books.includes(book._id))
    } catch (error) {
      console.error(error)
    }
  }

  const mintAccessNFT = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const contract = new ethers.Contract(
        contractAddress,
        BookAccessNFT.abi,
        signer
      )
      const transaction = await contract.mintAccessNFT(
        accountState.account.address,
        book._id
      )

      await transaction.wait()
      getAccessedBooksByAddress()
    }
  }

  useEffect(() => {
    const bookId = router.query.book_id
    fetchBook(bookId)
  }, [])

  useEffect(() => {
    if (book) {
      getAccessedBooksByAddress()
    }
  }, [book])

  console.log(accountState.account)

  const fetchBook = async (bookId) => {
    const res = await fetch("/api/fetchBookById", {
      method: "POST",
      body: JSON.stringify({
        bookId: bookId,
      }),
    })
    const json = await res.json()

    setBook(json)
  }

  if (!book) {
    return null
  }

  const notEnoughFunds =
    parseInt(book.premiumPrice) >= parseInt(accountState.account.balance)

  return (
    <div className="my-book">
      <h2 className="my-book__title">{book.bookName}</h2>
      {!hasAccess && (
        <Tooltip title={notEnoughFunds && "Not Enough Funds"}>
          <Button disabled={notEnoughFunds} onClick={buyAccess}>
            Buy
          </Button>
        </Tooltip>
      )}
      <Collapse expandIcon={() => <LockOutlined />}>
        {book.chapters.map((chapter, index) => (
          <Collapse.Panel
            showArrow={index > 2 && !hasAccess}
            disabled={index > 2 && !hasAccess}
            header={`Chapter ${index + 1} - ${chapter.chapterName}`}
            key={index}
          >
            <p>{chapter.content}</p>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  )
}

export default Book

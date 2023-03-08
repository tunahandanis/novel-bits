import { useAccountContext } from "@/context/accountContext"
import { Button, Collapse, Spin, Tooltip } from "antd"
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
  const [isBuying, setIsBuying] = useState(false)

  const { accountState } = useAccountContext()

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

    setIsBuying(true)

    try {
      await signer.sendTransaction(params)
      await mintAccessNFT()
      await getAccessedBooksByAddress()
    } catch (error) {
      console.error(error)
      setIsBuying(false)
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
      setIsBuying(false)
    } catch (error) {
      console.error(error)
      setIsBuying(false)
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

      try {
        await transaction.wait()
        getAccessedBooksByAddress()
      } catch (error) {
        console.error(error)
        setIsBuying(false)
      }
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
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    )
  }

  const isReaderTheAuthor =
    book.authorWalletAddress === accountState?.account?.address

  const notEnoughFunds =
    parseInt(book.premiumPrice) >= parseInt(accountState?.account?.balance)

  console.log(isReaderTheAuthor)

  return (
    <div className="my-book">
      <h2 className="my-book__title">{book.bookName}</h2>
      {!hasAccess && !isReaderTheAuthor && (
        <div className="my-book__buy">
          <Tooltip title={notEnoughFunds && "Not Enough Funds"}>
            <Button
              disabled={notEnoughFunds}
              onClick={buyAccess}
              loading={isBuying}
              size="large"
              type="primary"
            >
              Buy
            </Button>
          </Tooltip>
          <h4>{`${book.premiumPrice} FTM`}</h4>
        </div>
      )}
      {book.chapters.length ? (
        <Collapse expandIcon={() => <LockOutlined />}>
          {book.chapters.map((chapter, index) => (
            <Collapse.Panel
              showArrow={index > 2 && !hasAccess && !isReaderTheAuthor}
              disabled={index > 2 && !hasAccess && !isReaderTheAuthor}
              header={`Chapter ${index + 1} - ${chapter.chapterName}`}
              key={index}
            >
              <p>{chapter.content}</p>
            </Collapse.Panel>
          ))}
        </Collapse>
      ) : (
        <div className="my-book__no-chapters">
          <h3>No Chapters Written</h3>
        </div>
      )}
    </div>
  )
}

export default Book

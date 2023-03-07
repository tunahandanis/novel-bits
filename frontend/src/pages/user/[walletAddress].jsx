import { useAccountContext } from "@/context/accountContext"
import { Button, Input, Modal } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"

const User = () => {
  const [books, setBooks] = useState()
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false)
  const [bookNameInput, setBookNameInput] = useState("")
  const [priceInput, setPriceInput] = useState("")

  const { accountState, checkIfWalletIsConnected } = useAccountContext()

  const hideModal = () => {
    setIsNewBookModalOpen(false)
  }

  const showModal = () => {
    setIsNewBookModalOpen(true)
  }

  const insertBook = async () => {
    //checkIfWalletIsConnected()

    const newBook = {
      bookName: bookNameInput,
      authorWalletAddress: accountState.account.address,
      premiumPrice: priceInput,
    }

    try {
      axios.post("/api/createBook", newBook)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchBooks = async () => {
    const res = await fetch("/api/getBooks")
    const json = await res.json()

    setBooks(json)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div>
      <Button onClick={showModal}>Write a new book!</Button>
      <Modal
        title="Enter a name for your new NFT collection"
        open={isNewBookModalOpen}
        onOk={hideModal}
        onCancel={hideModal}
        footer={[
          <Button
            key="create"
            onClick={() => {
              if (bookNameInput.trim() !== "" && priceInput.trim() !== "") {
                insertBook()
                setBookNameInput("")
                setPriceInput("")
                setIsNewBookModalOpen(false)
              }
            }}
          >
            Create
          </Button>,
        ]}
      >
        <Input
          placeholder="Book name"
          onChange={(e) => setBookNameInput(e.target.value)}
          value={bookNameInput}
        />
        <Input
          placeholder="Price for premium chapters"
          onChange={(e) => setPriceInput(e.target.value)}
          value={priceInput}
        />
      </Modal>
    </div>
  )
}

export default User

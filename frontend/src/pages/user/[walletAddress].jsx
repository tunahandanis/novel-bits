import { useAccountContext } from "@/context/accountContext"
import { Button, Input, Modal, Table } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { getBooksTableColumns } from "@/utils/helpers"

const User = () => {
  const [books, setBooks] = useState()
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false)
  const [bookNameInput, setBookNameInput] = useState("")
  const [priceInput, setPriceInput] = useState("")

  const { accountState, checkIfWalletIsConnected, accountDispatch } =
    useAccountContext()

  const hideModal = () => {
    setIsNewBookModalOpen(false)
  }

  const showModal = () => {
    setIsNewBookModalOpen(true)
  }

  const insertBook = async () => {
    checkIfWalletIsConnected(accountDispatch)

    const newBook = {
      bookName: bookNameInput,
      authorWalletAddress: accountState?.account?.address,
      premiumPrice: priceInput,
    }

    try {
      axios.post("/api/createBook", newBook)
    } catch (e) {
      console.error(e)
    }

    setBookNameInput("")
    setPriceInput("")
    setIsNewBookModalOpen(false)
  }

  const fetchBooks = async () => {
    const res = await fetch("/api/getBooks")
    const json = await res.json()

    setBooks(json)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  if (!books) {
    return null
  }

  return (
    <div>
      <Button onClick={showModal}>Write a new book!</Button>
      <div>
        <Table
          size="small"
          dataSource={Object.values(books)}
          columns={Object.values(getBooksTableColumns())}
          rowKey={(record) => record?._id}
          pagination={false}
        />
      </div>
      <Modal
        title="Create a new book"
        open={isNewBookModalOpen}
        onOk={hideModal}
        onCancel={hideModal}
        footer={[
          <Button
            key="create"
            onClick={() => {
              if (bookNameInput.trim() !== "" && priceInput.trim() !== "") {
                insertBook()
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
          placeholder="Price for unlocked chapters"
          onChange={(e) => setPriceInput(e.target.value)}
          value={priceInput}
        />
      </Modal>
    </div>
  )
}

export default User

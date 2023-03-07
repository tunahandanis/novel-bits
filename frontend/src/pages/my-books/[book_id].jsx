import { useAccountContext } from "@/context/accountContext"
import { Button, Input, Modal } from "antd"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const MyBook = () => {
  const router = useRouter()
  const [book, setBook] = useState()

  const [isNewChapterModalOpen, setIsNewChapterModalOpen] = useState(false)
  const [chapterNameInput, setChapterNameInput] = useState("")
  const [contentInput, setContentInput] = useState("")

  const { checkIfWalletIsConnected, accountDispatch } = useAccountContext()

  const hideModal = () => {
    setIsNewChapterModalOpen(false)
  }

  const showModal = () => {
    setIsNewChapterModalOpen(true)
  }

  useEffect(() => {
    const bookId = router.query.book_id
    fetchBook(bookId)
  }, [])

  const fetchBook = async (bookId) => {
    const res = await fetch("/api/getBooks")
    const json = await res.json()

    const foundBook = json.find((e) => e._id === bookId)

    setBook(foundBook)
  }

  const insertChapter = async () => {
    checkIfWalletIsConnected(accountDispatch)

    const newChapter = {
      bookId: book._id,
      newChapter: {
        chapterName: chapterNameInput,
        content: contentInput,
      },
    }

    try {
      axios.post("/api/addChapter", newChapter).then((res) => setBook(res.data))
    } catch (e) {
      console.error(e.response.data)
    }

    setChapterNameInput("")
    setContentInput("")
    setIsNewChapterModalOpen(false)
  }

  if (!book) {
    return null
  }

  return (
    <div className="my-book">
      <h2 className="my-book__title">{book.bookName}</h2>
      <div className="my-book_chapters">
        {book.chapters.map((chapter, index) => (
          <p key={index}>{chapter?.content}</p>
        ))}
      </div>
      <Button onClick={showModal}>New Chapter</Button>
      <Modal
        title="Write a new chapter"
        open={isNewChapterModalOpen}
        onOk={hideModal}
        onCancel={hideModal}
        footer={[
          <Button
            key="create"
            onClick={() => {
              if (
                chapterNameInput.trim() !== "" &&
                contentInput.trim() !== ""
              ) {
                insertChapter()
              }
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Input
          placeholder="Chapter name"
          onChange={(e) => setChapterNameInput(e.target.value)}
          value={chapterNameInput}
        />
        <Input
          placeholder="Chapter content"
          onChange={(e) => setContentInput(e.target.value)}
          value={contentInput}
        />
      </Modal>
    </div>
  )
}

export default MyBook

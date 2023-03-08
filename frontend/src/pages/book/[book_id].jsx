import { useAccountContext } from "@/context/accountContext"
import { Button, Collapse, Input, Modal } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { LockOutlined } from "@ant-design/icons"

const Book = () => {
  const router = useRouter()
  const [book, setBook] = useState()

  const { checkIfWalletIsConnected, accountDispatch } = useAccountContext()

  useEffect(() => {
    const bookId = router.query.book_id
    fetchBook(bookId)
  }, [])

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

  return (
    <div className="my-book">
      <h2 className="my-book__title">{book.bookName}</h2>

      <Collapse expandIcon={() => <LockOutlined />}>
        {book.chapters.map((chapter, index) => (
          <Collapse.Panel
            showArrow={index > 2}
            disabled={index > 2}
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

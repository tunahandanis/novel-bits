import { useAccountContext } from "@/context/accountContext"
import { Button, Table } from "antd"
import { useEffect, useState } from "react"
import { getBooksTableColumns } from "@/utils/helpers"

const Explore = () => {
  const [books, setBooks] = useState()

  const { accountState, checkIfWalletIsConnected, accountDispatch } =
    useAccountContext()

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
      <div>
        <Table
          size="small"
          dataSource={Object.values(books)}
          columns={Object.values(getBooksTableColumns(false))}
          rowKey={(record) => record?._id}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default Explore

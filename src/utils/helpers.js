import { message } from "antd"
import Link from "next/link"
import CopyToClipboard from "react-copy-to-clipboard"
import { formatAccount } from "./common"

export const getBooksTableColumns = (isAuthor) => {
  const columns = {
    Name: {
      title: () => <strong>Name</strong>,
      key: "name",
      dataIndex: "bookName",
    },
    Price: {
      title: () => <strong>Price</strong>,
      key: "price",
      dataIndex: "premiumPrice",
      render: (price) => `${price} FTM`,
    },
    Chapters: {
      title: () => <strong>Chapters</strong>,
      key: "chapters",
      dataIndex: "",
      render: (row) => row.chapters.length,
    },
    Author: {
      title: () => <strong>Author</strong>,
      key: "author",
      dataIndex: "authorWalletAddress",
      render: (add) => (
        <CopyToClipboard
          text={add}
          onCopy={() => {
            message.open({
              type: "info",
              content: "Copied to clipboard",
            })
          }}
        >
          <span style={{ color: "#40a9ff", cursor: "pointer" }}>
            {formatAccount(add)}
          </span>
        </CopyToClipboard>
      ),
    },
    Link: {
      title: () => <strong>Go To Book</strong>,
      key: "chapters",
      dataIndex: "_id",
      render: (_id) => (
        <Link href={`/${isAuthor ? "my-books" : "book"}/${_id}`}>Book</Link>
      ),
    },
  }

  const newColumns = { ...columns }
  return newColumns
}

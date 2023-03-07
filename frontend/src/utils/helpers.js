import Link from "next/link"

export const getBooksTableColumns = () => {
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
    },
    Chapters: {
      title: () => <strong>Chapters</strong>,
      key: "chapters",
      dataIndex: "",
      render: (row) => row.chapters.length,
    },
    Link: {
      title: () => <strong>Go To Book</strong>,
      key: "chapters",
      dataIndex: "_id",
      render: (_id) => <Link href={`/my-books/${_id}`}>Book</Link>,
    },
  }

  const newColumns = { ...columns }
  return newColumns
}

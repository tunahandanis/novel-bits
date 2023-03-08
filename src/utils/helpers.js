import Link from "next/link"

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

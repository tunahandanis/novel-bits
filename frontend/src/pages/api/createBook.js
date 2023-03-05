import dbConnect from "../../utils/dbConnect"
import Book from "../../models/bookModel"

dbConnect()

export default async function handler(req, res) {
  const bookName = req.body.bookName
  const authorWalletAddress = req.body.authorWalletAddress
  const premiumPrice = req.body.premiumPrice

  const newBook = new Book({
    bookName,
    authorWalletAddress,
    premiumPrice,
  })

  newBook.save()
  res.send(200)
}

import mongoose from "mongoose"

const connection = {}

async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  // eslint-disable-next-line no-undef
  const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@novel-bits.nqwtzmx.mongodb.net/?retryWrites=true&w=majority`

  const db = await mongoose.connect(mongoURI, {
    dbName: "novel_bits",

    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  connection.isConnected = db.connections[0].readyState
}

export default dbConnect

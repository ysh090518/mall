import express from "express"
const itemRouter = express.Router()
import Item from "../models/Item.js"

itemRouter.get('/', async (req,res) => {
   const items = await Item.find({})
   return res.render("products", {items, title: "상품 목록", user: req.session.user})
})

export default itemRouter
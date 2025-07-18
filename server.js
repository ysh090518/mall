import express from "express"
const application = express()
import engine from 'ejs-locals'
import path from "path"
import { fileURLToPath } from "url"
const filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(filename)

application.use(express.static(path.join(__dirname,"public")))
application.use(express.json())
application.use(express.urlencoded({extended: true}))

application.engine('ejs',engine)
application.set('view engine','ejs')
application.set('views', path.join(__dirname, 'views'))

application.get('/', (req,res)=>{
    res.render("home", {title: "shoppingmall"})
})


application.listen(3000, () =>{
    console.log("🚀 Server is running on http://localhost:3000")
})
import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Item from "./models/Item.js";
dotenv.config();

mongoose.connect(process.env.DB_URL);
mongoose.connection.once("open", async () => {
  console.log("MongoDB is connected");
  const admin = await User.findOne({ role: "admin" });
  let birthday = new Date();
  birthday.setFullYear(2009);
  birthday.setMonth(4);
  birthday.setDate(18);
  if (!admin) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    User.create({
      username: "suhun",
      role: "admin",
      gender: "F",
      birth: birthday,
      password: hash,
    });
  }
  const itemCount = await Item.countDocuments();
  if (itemCount === 0) {
    await Item.insertMany([
      {
        name: "심플 반팔티",
        price: 12000,
        image:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRjPF98F7CPYmMyFw52XPAs9NwFdHyirqXdb4OLuo2f_GVu7iWoRMaCXbsKpo0",
        description: "기본에 충실한 심플 반팔티.",
        stock: 50,
        category: "의류",
      },
      {
        name: "데일리 에코백",
        price: 18000,
        image:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTjq8s7K2o4SrGuO9IPiStwQix2bnR339fpXsVDDsM-QIAK2J0-sL_C9IMzrA",
        description: "가볍고 튼튼한 데일리 에코백.",
        stock: 30,
        category: "가방",
      },
      {
        name: "미니멀 머그컵",
        price: 8000,
        image:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS4akQPhbddiAo6B5WvUHWBWfxORevlmT_vZduBUJCRY_CqQa68GZgrJBdp5j1BgAirdNuWZXS8Ig",
        description: "심플한 디자인의 머그컵.",
        stock: 100,
        category: "주방용품",
      },
    ]);
    console.log("🛒 더미 상품 데이터가 추가되었습니다.");
  }
});

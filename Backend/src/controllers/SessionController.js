const knex = require("../database/knex/knex")
const ErrorHandler = require("../utils/ErrorHandler")

const { compare } = require("bcrypt")
const { sign, verify } = require("jsonwebtoken")
const { jwtConfig } = require("../configs/auth")

class SessionController {
  async create(req, res) {
    const { email, password } = req.body

    const [user] = await knex("users")
      .where({ email: email.toLowerCase() })
      .select("id", "name", "email", "password", "avatar")

    if (!user) {
      throw new ErrorHandler("Email e/ou password incorretos :(")
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new ErrorHandler("Email e/ou password incorretos :(")
    }

    const { secret, expiresIn } = jwtConfig
    const token = sign({ userId: user.id }, secret, { expiresIn })
    delete user["password"]

    const date = new Date()
    const expiresDt = new Date(date.setDate(date.getDate() + 1))

    return res.json({
      user,
      token,
      expiresDt: expiresDt.toLocaleString("pt-BR"),
    })
  }

  validate = async (req, res) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(400).json({ message: "Token não foi informado!!" })
    }

    // split token
    const [, token] = authHeader.split(" ")

    try {
      const { userId } = verify(token, jwtConfig.secret)
      return res.status(200).json({ message: "Token validado!!" })
    } catch {
      return res.status(401).json({ message: "Token inválido!!" })
    }
  }
}

module.exports = SessionController

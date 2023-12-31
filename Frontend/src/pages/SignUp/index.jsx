import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiMail, FiLock } from "react-icons/fi"

import { Container, FormSide } from "./styles"

import { ImageBackground } from "../../components/ImageBackground"
import { LoginHeader } from "../../components/LoginHeader"
import { Input } from "../../components/Input"
import { InputPassword } from "../../components/InputPassword"
import { Button } from "../../components/Button"

import { useAuth } from "../../hooks/auth"

export const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleSignUp = async (e) => {
    e.preventDefault()

    await signUp({ email, password })
    navigate("/")
  }

  return (
    <Container>
      <FormSide>
        <LoginHeader text="Faça seu login" />

        <form>
          <Input
            type="email"
            placeholder="E-Mail"
            icon={FiMail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputPassword
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" text="Entrar" onClick={handleSignUp} />
        </form>

        <Link to="/register">Criar Conta</Link>
      </FormSide>
      <ImageBackground />
    </Container>
  )
}

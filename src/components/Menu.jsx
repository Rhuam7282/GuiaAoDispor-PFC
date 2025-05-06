import { useState } from 'react'
import './App.css'
import('./components/Menu')
import logo from "../assets/react.svg"

const Nav = () => {
    return (
        <nav>
            <img src={logo} alt="um rosto de cachorro minimalista que utiliza de tons amarronzados"/>
            <ul>
                <li>Início</li>
                <li>Perfil</li>
                <li>Mensagens</li>
                <li>Contato</li>
            </ul>
        </nav>
    )
}

export default Menu
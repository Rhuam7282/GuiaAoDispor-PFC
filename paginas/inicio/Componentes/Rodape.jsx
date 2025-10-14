import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Instagram,
  Mail,
  GalleryHorizontal,
  Phone,
  MapPin,
  Mail as MailIcon,
} from "lucide-react";
import "./Rodape.css";
import logo from "../../../Recursos/icones/logo.png";

const Rodape = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const linksRapidos = [
    { Icone: GalleryHorizontal, texto: "Qualificados", rota: "/qualificados" },
    { Icone: User, texto: "Perfil", rota: "/perfil" },
    { Icone: Mail, texto: "Sobre Nós", rota: "/sobreNos" },
  ];

  const handleNavigation = (rota) => {
    navigate(rota);
  };

  return (
    <footer className="footer">
      <div className="containerFooter">
        {/* Seção Superior do Footer */}
        <div className="footerSuperior">
          {/* Links Rápidos */}
          <div className="footerSection">
            <h4 className="tituloFooter">Links Rápidos</h4>
            <ul className="listaFooter">
              {linksRapidos.map((item) => (
                <li key={item.texto} className="itemListaFooter">
                  <button
                    className={`botaoFooter ${
                      location.pathname === item.rota ? "ativo" : ""
                    }`}
                    onClick={() => handleNavigation(item.rota)}
                  >
                    <item.Icone size={16} />
                    <span>{item.texto}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="footerSection">
            <h4 className="tituloFooter">Contato</h4>
            <div className="infoContato">
              <div className="itemContato">
                <Instagram size={16} />
                <span>@guiaodispor</span>
              </div>
              <div className="itemContato">
                <MailIcon size={16} />
                <span>guiaaodsipor@gmail.com</span>
              </div>
              <div className="itemContato">
                <MapPin size={16} />
                <span>Assis Chateaubriand, PR - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="linhaDivisoria"></div>

        {/* Seção Inferior do Footer */}
        <div className="footerInferior">
          <div className="copyright">
            <p>
              &copy; {new Date().getFullYear()} Guia ao Dispor. Todos os
              direitos reservados.
            </p>
          </div>
          <div className="linksLegais">
            <button className="botaoLegal">Política de Privacidade</button>
            <button className="botaoLegal">Termos de Uso</button>
            <button className="botaoLegal">Nosso Artigo</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;
import React from 'react';
import { Mail, Facebook, Instagram } from 'lucide-react';

const RedesSociais = () => {
  const redesSociais = [
    { icone: Mail, usuario: "contato@guiaoadispor.com" },
    { icone: Facebook, usuario: "Guia ao Dispor" },
    { icone: Instagram, usuario: "@guiaoadispor" },
  ];

  return (
    <aside className='redes'>
      <div className="listaIcones vertical">
        {redesSociais.map((rede, indice) => {
          const Icone = rede.icone;
          return (
            <div key={indice} className="listaIcones">
              <Icone size={18} />
              <span>{rede.usuario}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default RedesSociais;


// export default function Profissionais() {
// const profiles = [
//   { name: "Nome da pessoa 1", location: "Localização 1", experience: "Experiências 1" },
//   { name: "Nome da pessoa 2", location: "Localização 2", experience: "Experiências 2" },
//   { name: "Nome da pessoa 3", location: "Localização 3", experience: "Experiências 3" },
//   { name: "Nome da pessoa 4", location: "Localização 4", experience: "Experiências 4" },
//   { name: "Nome da pessoa 5", location: "Localização 5", experience: "Experiências 5" },
// ];

// return (
//   <div className="max-w-4xl mx-auto mt-10 p-6">
//     <h1 className="text-3xl font-bold mb-8 text-center">Profissionais</h1>
    
//     <div className="space-y-6">
//       {profiles.map((profile, index) => (
//         <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//           <h2 className="text-xl font-semibold mb-2"># {profile.name}</h2>
//           <p className="text-gray-600 mb-1">{profile.location}</p>
//           <p className="text-gray-700">{profile.experience}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// );
// };

function Profissionais() {
  const localProfiles = [
    { 
      name: "Maria Silva", 
      location: "São Paulo, SP", 
      experience: "10 anos de experiência em enfermagem geriátrica"
    },
    { 
      name: "João Oliveira", 
      location: "Rio de Janeiro, RJ", 
      experience: "Especialista em LIBRAS com 8 anos de mercado"
    },
    // ... outros dados locais
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Profissionais Cadastrados
      </h1>

      {/* Lista de profissionais - Estrutura similar à imagem */}
      <div className="space-y-8">
        {localProfiles.map((profile, index) => (
          <div key={index} className="group">
            {/* Cabeçalho com nome */}
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              # {profile.name}
            </h2>

            {/* Container de informações */}
            <div className="ml-4 space-y-3">
              {/* Localização */}
              <div className="flex items-start">
                <span className="block w-24 text-gray-600">Localização</span>
                <span className="text-gray-800 flex-1">{profile.location}</span>
              </div>

              {/* Experiências */}
              <div className="flex items-start">
                <span className="block w-24 text-gray-600">Experiências</span>
                <span className="text-gray-800 flex-1">{profile.experience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profissionais;
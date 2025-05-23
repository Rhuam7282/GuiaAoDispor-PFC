export default function Profissionais() {
  const profiles = [
    { name: "Nome da pessoa 1", location: "Localização 1", experience: "Experiências 1" },
    { name: "Nome da pessoa 2", location: "Localização 2", experience: "Experiências 2" },
    { name: "Nome da pessoa 3", location: "Localização 3", experience: "Experiências 3" },
    { name: "Nome da pessoa 4", location: "Localização 4", experience: "Experiências 4" },
    { name: "Nome da pessoa 5", location: "Localização 5", experience: "Experiências 5" },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Profissionais</h1>
      
      <div className="space-y-6">
        {profiles.map((profile, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2"># {profile.name}</h2>
            <p className="text-gray-600 mb-1">{profile.location}</p>
            <p className="text-gray-700">{profile.experience}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
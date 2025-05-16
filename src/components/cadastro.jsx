export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <p className="text-gray-600 mb-8 text-center">
        Crie uma conta agora e comece a desfrutar do nosso site
      </p>

      <div className="mb-6">
        <label className="block mb-4 font-medium">Tipo de perfil</label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="profileType" className="h-4 w-4" />
            Cliente
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="profileType" className="h-4 w-4" />
            Profissional
          </label>
        </div>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Nome completo</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">E-mail</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Senha</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
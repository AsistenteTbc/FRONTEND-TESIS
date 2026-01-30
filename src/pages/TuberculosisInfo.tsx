import { Activity, AlertCircle, Shield, Users, TrendingDown, Droplet, Wind, FileText, CheckCircle, XCircle } from 'lucide-react';

const TuberculosisInfo = () => {
  const symptoms = [
    { icon: Wind, title: 'Tos Persistente', description: 'Tos por más de 2 semanas, a veces con sangre' },
    { icon: Activity, title: 'Fiebre', description: 'Fiebre persistente, especialmente nocturna' },
    { icon: Droplet, title: 'Sudoración', description: 'Sudores nocturnos abundantes' },
    { icon: TrendingDown, title: 'Pérdida de Peso', description: 'Pérdida de peso no intencional' },
  ];

  const riskFactors = [
    'Sistema inmunológico debilitado (VIH/SIDA)',
    'Diabetes mellitus',
    'Malnutrición',
    'Uso de tabaco',
    'Contacto cercano con persona infectada',
    'Condiciones de hacinamiento',
  ];

  const prevention = [
    { icon: Shield, text: 'Vacunación BCG en recién nacidos' },
    { icon: Users, text: 'Evitar contacto cercano con personas infectadas' },
    { icon: Wind, text: 'Buena ventilación en espacios cerrados' },
    { icon: CheckCircle, text: 'Completar el tratamiento si se diagnostica' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      
      {/* Hero Section - Mejorada para responsive */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl w-fit">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              TBC
            </h1>
          </div>
          <p className="text-blue-50 text-base md:text-xl max-w-3xl leading-relaxed">
            La tuberculosis es una enfermedad infecciosa causada por la bacteria <span className="font-semibold">Mycobacterium tuberculosis</span>. Afecta principalmente los pulmones, pero puede atacar otras partes del cuerpo.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">Alcance Global</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-400 mb-2">10 millones</p>
          <p className="text-gray-300 text-sm">de personas enferman de TBC cada año en el mundo</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">Curable</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">85-90%</p>
          <p className="text-gray-300 text-sm">tasa de curación con tratamiento adecuado y completo</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">Prevenible</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">Vacuna BCG</p>
          <p className="text-gray-300 text-sm">protege contra formas graves en niños</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Symptoms */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="bg-blue-500/10 p-3 rounded-xl w-fit">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Síntomas Principales</h2>
          </div>
          <div className="space-y-3">
            {symptoms.map((symptom, index) => {
              const Icon = symptom.icon;
              return (
                <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200">
                  <div className="bg-blue-500/10 p-2 sm:p-2.5 rounded-lg mt-0.5 sm:mt-1 flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{symptom.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{symptom.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-200 text-xs sm:text-sm">
              <strong>Importante:</strong> Si presentas tos por más de 2 semanas, consulta inmediatamente con un profesional de salud.
            </p>
          </div>
        </div>

        {/* Risk Factors & Prevention */}
        <div className="space-y-6">
          {/* Risk Factors */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6 hover:border-red-500/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <div className="bg-red-500/10 p-3 rounded-xl w-fit">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Factores de Riesgo</h2>
            </div>
            <ul className="space-y-2 sm:space-y-3">
              {riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6 hover:border-green-500/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <div className="bg-green-500/10 p-3 rounded-xl w-fit">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Prevención</h2>
            </div>
            <div className="space-y-3">
              {prevention.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Transmission Info */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="bg-purple-500/10 p-3 rounded-xl w-fit">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">¿Cómo se Transmite?</h2>
            <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
              La tuberculosis se transmite de persona a persona a través del aire. Cuando una persona con TBC pulmonar tose, estornuda o habla, expulsa bacilos de tuberculosis al aire. Basta con inhalar algunos de estos bacilos para quedar infectado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-purple-500/5 p-3 sm:p-4 rounded-xl border border-purple-500/10">
                <h3 className="font-semibold text-purple-300 mb-2 text-sm sm:text-base">✓ Se transmite por:</h3>
                <ul className="text-gray-400 text-xs sm:text-sm space-y-1">
                  <li>• Tos y estornudos</li>
                  <li>• Hablar o cantar</li>
                  <li>• Contacto prolongado en espacios cerrados</li>
                </ul>
              </div>
              <div className="bg-green-500/5 p-3 sm:p-4 rounded-xl border border-green-500/10">
                <h3 className="font-semibold text-green-300 mb-2 text-sm sm:text-base">✗ NO se transmite por:</h3>
                <ul className="text-gray-400 text-xs sm:text-sm space-y-1">
                  <li>• Dar la mano</li>
                  <li>• Compartir alimentos o bebidas</li>
                  <li>• Tocar ropa de cama</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Info */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="bg-blue-500/10 p-3 rounded-xl w-fit">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Tratamiento</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="bg-blue-500/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-xl sm:text-3xl font-bold text-blue-400">6</span>
            </div>
            <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Duración</h3>
            <p className="text-gray-400 text-xs sm:text-sm">meses de tratamiento continuo</p>
          </div>
          <div className="text-center">
            <div className="bg-green-500/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Gratuito</h3>
            <p className="text-gray-400 text-xs sm:text-sm">El tratamiento es gratuito en todo el país</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-500/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Efectivo</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Alta tasa de curación si se completa</p>
          </div>
        </div>
        <div className="mt-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-200 text-xs sm:text-sm text-center">
            <strong>Crucial:</strong> NO abandonar el tratamiento. Suspenderlo puede generar resistencia a los medicamentos y complicar la curación.
          </p>
        </div>
      </div>

    </div>
  );
};

export default TuberculosisInfo;
import { Smartphone, Users, Shield, QrCode, ArrowRight } from "lucide-react";

export default function HomePage() {
  const panels = [
    {
      href: "/totem",
      icon: Smartphone,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "TOTEM",
      description: "Triagem inicial do paciente com IA conversacional",
    },
    {
      href: "/attendant",
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Atendente",
      description: "Gerenciar fila, salas e relatórios do dia",
    },
    {
      href: "/chamadas-display",
      icon: QrCode,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Painel Chamadas",
      description: "Display de chamadas para TV/Monitor em tempo real",
    },
    {
      href: "/admin",
      icon: Shield,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Administrador",
      description: "Controlar atendentes, salas e estatísticas",
    },
    {
      href: "/patient-portal",
      icon: QrCode,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Portal Paciente",
      description: "Visualizar dados via QR Code",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white bg-opacity-80 backdrop-blur-sm border-b border-[#ECEFF9] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E39C9] to-[#1E2A99] rounded-lg flex items-center justify-center text-white font-poppins font-bold">
              SM
            </div>
            <h1 className="text-2xl font-poppins font-bold text-[#2E39C9]">
              Saúde Mais
            </h1>
          </div>
          <p className="text-[#7B8198] font-inter hidden md:block">
            Sistema de Triagem Inteligente
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#1E2559] mb-4">
            Sistema de Triagem Inteligente
          </h2>
          <p className="text-lg text-[#7B8198] font-inter max-w-2xl mx-auto mb-8">
            Otimizando o atendimento em hospitais e UPAs com inteligência
            artificial
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <a key={panel.href} href={panel.href}>
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer group h-full flex flex-col">
                  <div
                    className={`w-12 h-12 ${panel.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:opacity-80 transition-opacity`}
                  >
                    <Icon className={panel.iconColor} size={24} />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-[#1E2559] mb-2">
                    {panel.title}
                  </h3>
                  <p className="text-[#7B8198] font-inter text-sm mb-4 flex-grow">
                    {panel.description}
                  </p>
                  <div className="flex items-center gap-2 text-[#2E39C9] font-inter font-semibold text-sm group-hover:gap-3 transition-all">
                    Acessar <ArrowRight size={18} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h3 className="text-2xl font-poppins font-bold text-[#1E2559] mb-8 text-center">
            Funcionalidades Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2E39C9] flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-[#1E2559] mb-1">
                  Triagem com IA
                </h4>
                <p className="text-[#7B8198] font-inter text-sm">
                  Avaliação inteligente de sintomas com determinação de nível de
                  risco
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2E39C9] flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-[#1E2559] mb-1">
                  Prioridade por Risco
                </h4>
                <p className="text-[#7B8198] font-inter text-sm">
                  Fila ordenada por nível de risco e idade (idosos prioritários)
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2E39C9] flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-[#1E2559] mb-1">
                  Voz e Microfone
                </h4>
                <p className="text-[#7B8198] font-inter text-sm">
                  IA fala com o paciente e aceita entrada de voz
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2E39C9] flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-[#1E2559] mb-1">
                  QR Code
                </h4>
                <p className="text-[#7B8198] font-inter text-sm">
                  Pacientes acessam dados via QR Code gerado na triagem
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2E39C9] flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-[#1E2559] mb-1">
                  Relatórios
                </h4>
                <p className="text-[#7B8198] font-inter text-sm">
                  Estatísticas e relatórios em PDF (dia/semana/mês)
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2E39C9] flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-[#1E2559] mb-1">
                  Gerenciamento
                </h4>
                <p className="text-[#7B8198] font-inter text-sm">
                  Controle completo de atendentes, salas e consultas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-[#2E39C9] to-[#1E2A99] rounded-2xl shadow-lg p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl font-poppins font-bold mb-4">
            Pronto para Começar?
          </h3>
          <p className="font-inter mb-8 max-w-2xl mx-auto">
            Clique em uma das opções acima para acessar o sistema desejado
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="/totem"
              className="px-8 py-3 bg-white text-[#2E39C9] rounded-lg font-poppins font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Iniciar Triagem
            </a>
            <a
              href="/attendant"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-poppins font-semibold hover:bg-white hover:bg-opacity-10 transition-colors inline-block"
            >
              Painel Atendente
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#ECEFF9] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-[#7B8198] font-inter text-sm">
            Saúde Mais © 2025 - Sistema de Triagem Inteligente para Hospitais e
            UPAs
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}

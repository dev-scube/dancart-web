import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Heart, Users, Trophy } from "lucide-react";
import { Link } from "wouter";
import DepoimentosStatic from "@/components/DepoimentosStatic";
import AgendamentoSection from "@/components/AgendamentoSection";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/hero-dance.jpg)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 container text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            DançArt
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto">
            Espaço Cultural de Dança em Ouro Branco, MG
          </p>
          <p className="text-lg md:text-xl mb-8 italic max-w-xl mx-auto">
            "Onde cada movimento conta uma história"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ingressos">
              <Button size="lg" className="text-lg px-8">
                Ver Eventos
              </Button>
            </Link>
            <Link href="/mensalidades">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
                Matricule-se
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-primary">Quem Somos</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                O DançArt é um espaço cultural dedicado à arte da dança, localizado em Ouro Branco, Minas Gerais. 
                Funcionamos como uma escola de dança completa, oferecendo diversas modalidades para todas as idades.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nossa missão é formar não apenas bailarinos tecnicamente preparados, mas também artistas sensíveis 
                e conscientes, capazes de expressar emoções através do movimento e contribuir para a cultura local.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold">Paixão</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold">Comunidade</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold">Excelência</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/about-dance.jpg"
                alt="Alunas praticando dança"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

        {/* Agendamento Section */}
      <AgendamentoSection />

      {/* Depoimentos Section */}
      <DepoimentosStatic />

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6 text-primary">Nossa Missão</h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Promover a arte da dança como forma de expressão, desenvolvimento pessoal e integração social, 
            oferecendo ensino de qualidade e oportunidades para que nossos alunos possam brilhar em palcos, 
            competições e eventos culturais.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary">Entre em Contato</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Localização</h3>
                      <p className="text-muted-foreground">
                        Rua Principal, Centro<br />
                        Ouro Branco, MG<br />
                        CEP: 36420-000
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Telefone</h3>
                      <p className="text-muted-foreground">(31) 9999-9999</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Segunda a Sexta: 9h às 18h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-muted-foreground">contato@dancat.com.br</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/studio-space.jpg"
                alt="Espaço do estúdio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

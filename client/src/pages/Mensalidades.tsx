import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  frequency: "mensal" | "trimestral" | "semestral";
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 1,
    name: "Ballet Infantil",
    description: "Para crianças de 4 a 10 anos",
    price: 120,
    frequency: "mensal",
    features: [
      "2 aulas por semana",
      "Duração de 1 hora cada",
      "Material didático incluso",
      "Apresentações semestrais",
    ],
  },
  {
    id: 2,
    name: "Dança Contemporânea",
    description: "Para adolescentes e adultos",
    price: 150,
    frequency: "mensal",
    features: [
      "3 aulas por semana",
      "Duração de 1h30 cada",
      "Acesso a workshops",
      "Participação em eventos",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Jazz e Street Dance",
    description: "Para todas as idades",
    price: 140,
    frequency: "mensal",
    features: [
      "2 aulas por semana",
      "Duração de 1h15 cada",
      "Coreografias exclusivas",
      "Competições regionais",
    ],
  },
  {
    id: 4,
    name: "Plano Completo",
    description: "Acesso a todas as modalidades",
    price: 350,
    frequency: "mensal",
    features: [
      "Aulas ilimitadas",
      "Todas as modalidades",
      "Prioridade em workshops",
      "Desconto em eventos",
      "Acompanhamento personalizado",
    ],
  },
];

export default function Mensalidades() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedPlan: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.selectedPlan) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const selectedPlan = plans.find((p) => p.id.toString() === formData.selectedPlan);
    
    toast.success(
      `Solicitação enviada! Plano: ${selectedPlan?.name} - R$ ${selectedPlan?.price.toFixed(2)}/mês. Entraremos em contato em breve.`
    );
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      selectedPlan: "",
    });
  };

  return (
    <div className="py-12 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Planos e Mensalidades
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para você e faça parte da família DançArt
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col relative ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">
                    R$ {plan.price}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    setFormData({ ...formData, selectedPlan: plan.id.toString() });
                    document.getElementById("enrollment-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Escolher Plano
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enrollment Form */}
        <div id="enrollment-form" className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Formulário de Matrícula</CardTitle>
              <CardDescription className="text-center">
                Preencha os dados abaixo para solicitar sua matrícula
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(31) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan">Plano Escolhido</Label>
                  <Select
                    value={formData.selectedPlan}
                    onValueChange={(value) => handleInputChange("selectedPlan", value)}
                  >
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          {plan.name} - R$ {plan.price}/mês
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Solicitar Matrícula
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  * Este é um protótipo. O sistema de pagamento real será implementado posteriormente.
                  <br />
                  Entraremos em contato para finalizar sua matrícula.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

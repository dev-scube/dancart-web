// Componente de depoimentos que funciona estaticamente
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { mockDepoimentosApi } from "@/data/mockApi";
import { useEffect, useState } from "react";

export default function DepoimentosSection() {
  const [depoimentos, setDepoimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepoimentos = async () => {
      try {
        const data = await mockDepoimentosApi.list(true); // Apenas aprovados
        setDepoimentos(data);
      } catch (error) {
        console.error("Erro ao carregar depoimentos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDepoimentos();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            O que nossos alunos dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          O que nossos alunos dizem
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {depoimentos.map((depoimento) => (
            <Card key={depoimento.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < depoimento.avaliacao
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold">{depoimento.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  {depoimento.modalidade}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed italic">
                  "{depoimento.depoimento}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
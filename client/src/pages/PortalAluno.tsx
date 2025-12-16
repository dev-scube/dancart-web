import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Calendar, CreditCard, User, Bell } from "lucide-react";

export default function PortalAluno() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Em desenvolvimento sem OAuth configurado, permite acesso sem autenticação
  const isDevelopmentMode = import.meta.env.DEV && !import.meta.env.VITE_OAUTH_PORTAL_URL;

  useEffect(() => {
    if (!loading && !isAuthenticated && !isDevelopmentMode) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, isDevelopmentMode, setLocation]);

  // Email mockado para desenvolvimento sem OAuth
  const emailToUse = isDevelopmentMode && !user?.email 
    ? "aluno@exemplo.com" 
    : user?.email || "";

  const { data: bailarino } = trpc.bailarinos.getByEmail.useQuery(
    { email: emailToUse },
    { enabled: !!emailToUse }
  );

  const { data: matriculas } = trpc.matriculas.getByBailarinoId.useQuery(
    { bailarinoId: bailarino?.id || 0 },
    { enabled: !!bailarino?.id }
  );

  const { data: mensalidades } = trpc.mensalidades.getByMatriculaIds.useQuery(
    { matriculaIds: matriculas?.map((m) => m.id) || [] },
    { enabled: !!matriculas && matriculas.length > 0 }
  );

  if (loading && !isDevelopmentMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isDevelopmentMode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Portal do Aluno</h1>
          <p className="text-muted-foreground">
            Bem-vindo(a), {isDevelopmentMode && !user ? "Aluno de Exemplo" : (user?.name || user?.email)}
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
            <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Matrículas Ativas
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {matriculas?.filter((m) => m.status === "ativa").length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mensalidades Pendentes
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mensalidades?.filter((m) => m.status === "pendente").length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Próximo Vencimento
                  </CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mensalidades && mensalidades.length > 0
                      ? new Date(
                          mensalidades
                            .filter((m) => m.status === "pendente")
                            .sort(
                              (a, b) =>
                                new Date(a.dataVencimento).getTime() -
                                new Date(b.dataVencimento).getTime()
                            )[0]?.dataVencimento || ""
                        ).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })
                      : "--/--"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Avisos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Bem-vindo ao Portal do Aluno!</p>
                      <p className="text-sm text-muted-foreground">
                        Aqui você pode acompanhar suas matrículas, mensalidades e muito mais.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matriculas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Matrículas</CardTitle>
              </CardHeader>
              <CardContent>
                {!matriculas || matriculas.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Você ainda não possui matrículas ativas.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead>Data Início</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor Mensal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matriculas.map((matricula) => (
                        <TableRow key={matricula.id}>
                          <TableCell className="font-medium">
                            Curso #{matricula.cursoId}
                          </TableCell>
                          <TableCell>
                            {new Date(matricula.dataInicio).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                matricula.status === "ativa" ? "default" : "secondary"
                              }
                            >
                              {matricula.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            R$ {(matricula.valorMensalComDesconto / 100).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mensalidades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Mensalidades</CardTitle>
              </CardHeader>
              <CardContent>
                {!mensalidades || mensalidades.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma mensalidade encontrada.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês Referência</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mensalidades
                        .sort(
                          (a, b) =>
                            new Date(b.mesReferencia).getTime() -
                            new Date(a.mesReferencia).getTime()
                        )
                        .map((mensalidade) => (
                          <TableRow key={mensalidade.id}>
                            <TableCell>
                              {new Date(mensalidade.mesReferencia).toLocaleDateString(
                                "pt-BR",
                                { month: "long", year: "numeric" }
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(mensalidade.dataVencimento).toLocaleDateString(
                                "pt-BR"
                              )}
                            </TableCell>
                            <TableCell>
                              R$ {(mensalidade.valorOriginal / 100).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  mensalidade.status === "paga"
                                    ? "default"
                                    : mensalidade.status === "atrasada"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {mensalidade.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {mensalidade.status === "pendente" && (
                                <Button size="sm" variant="outline">
                                  Pagar
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bailarino ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{bailarino.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{bailarino.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{bailarino.telefone || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                      <p className="font-medium">
                        {new Date(bailarino.dataNascimento).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Perfil não encontrado. Entre em contato com a secretaria.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

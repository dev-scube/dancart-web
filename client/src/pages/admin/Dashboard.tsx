import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, AlertCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: matriculasPorCurso, isLoading: chartLoading } = trpc.dashboard.matriculasPorCurso.useQuery();

  if (statsLoading || chartLoading) {
    return (
      <div className="container py-8">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  const receitaMensalFormatada = stats?.receitaMensal 
    ? (stats.receitaMensal / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral do espaço cultural DançArt</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Bailarinos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBailarinos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Alunos ativos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cursos Ativos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCursos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Modalidades disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receitaMensalFormatada}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inadimplência
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.inadimplencia || 0}</div>
            <p className="text-xs text-muted-foreground">
              Mensalidades atrasadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Matrículas por Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matriculasPorCurso && matriculasPorCurso.length > 0 ? (
                matriculasPorCurso.map((item, index) => {
                  const total = matriculasPorCurso.reduce((acc, curr) => acc + Number(curr.totalMatriculas), 0);
                  const percentage = total > 0 ? (Number(item.totalMatriculas) / total) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.cursoNome}</span>
                        <span className="text-muted-foreground">{item.totalMatriculas} alunos</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma matrícula ativa encontrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Matrículas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total de Matrículas Ativas</span>
                <span className="text-2xl font-bold text-primary">{stats?.totalMatriculasAtivas || 0}</span>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3">Distribuição por Curso</h4>
                <div className="space-y-2">
                  {matriculasPorCurso && matriculasPorCurso.length > 0 ? (
                    matriculasPorCurso.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.cursoNome}</span>
                        <span className="font-medium">{item.totalMatriculas}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
              <p className="text-2xl font-bold">{receitaMensalFormatada}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Taxa de Inadimplência</p>
              <p className="text-2xl font-bold">
                {stats?.totalMatriculasAtivas && stats.totalMatriculasAtivas > 0
                  ? ((stats.inadimplencia / stats.totalMatriculasAtivas) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Receita Média por Aluno</p>
              <p className="text-2xl font-bold">
                {stats?.totalBailarinos && stats.totalBailarinos > 0 && stats?.receitaMensal
                  ? (stats.receitaMensal / stats.totalBailarinos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'R$ 0,00'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

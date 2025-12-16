import { useMockTrpc } from "@/lib/mockTrpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function DevLogin() {
  const [, setLocation] = useLocation();
  const trpc = useMockTrpc();
  const { data: user } = trpc.auth.me.useQuery();
  const loginMutation = trpc.auth.devLogin.useMutation({
    onSuccess: () => {
      window.location.href = "/admin";
    },
  });

  useEffect(() => {
    if (user?.role === "admin") {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  // Em modo estático, sempre permitir acesso
  const isProduction = import.meta.env.PROD;
  if (isProduction) {
    // No GitHub Pages, sempre mostrar o login
  } else if (process.env.NODE_ENV !== "development") {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Acesso Negado</CardTitle>
            <CardDescription>
              Esta página está disponível apenas em modo de desenvolvimento.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login de Desenvolvimento</CardTitle>
          <CardDescription>
            Faça login como administrador para acessar o dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Você está logado como:
              </p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm">
                  <span className="font-medium">Papel:</span>{" "}
                  <span className={user.role === "admin" ? "text-green-600" : "text-orange-600"}>
                    {user.role}
                  </span>
                </p>
              </div>
              {user.role === "admin" ? (
                <Button 
                  onClick={() => setLocation("/admin")} 
                  className="w-full"
                >
                  Ir para Dashboard
                </Button>
              ) : (
                <p className="text-sm text-destructive">
                  Seu usuário não tem permissões de administrador.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Atenção:</strong> Esta é uma função de desenvolvimento que cria uma sessão de administrador sem autenticação real.
                </p>
              </div>
              <Button
                onClick={() => loginMutation.mutate()}
                disabled={loginMutation.isPending}
                className="w-full"
              >
                {loginMutation.isPending ? "Autenticando..." : "Entrar como Admin"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

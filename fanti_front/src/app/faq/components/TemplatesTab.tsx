"use client";

import { DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Select, Space, Typography } from "antd";
import { useState } from "react";

const { Title, Paragraph, Text } = Typography;

interface TemplateOption {
  value: string;
  label: string;
  fileName: string;
  example: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    value: "tela-frontend",
    label: "Task de Implementação de Tela (Front-End)",
    fileName: "tela-frontend.txt",
    example: `Título: Implementação da Tela: Dashboard de Projetos

Resumo:
Implementação da tela inicial do dashboard que exibe a lista de projetos ativos, permitindo filtros por status e data. Resolve a necessidade de visualização rápida do portfólio.

Entrega:
- Componente ProjectsDashboard.tsx criado
- Funcionalidades: listagem, filtros, ordenação
- Consumo da API /api/projects (GET)

Como testar:
1. Acesse /projects
2. Verifique carregamento da lista
3. Teste filtros por status e período
4. Valide ordenação por nome/data

Impacto:
- src/app/projects/page.tsx
- src/components/ProjectsDashboard.tsx
- src/services/api.ts (novo método getProjects)

Pendências:
- Implementar paginação (Task #234)
- Adicionar exportação para Excel (Task #235)`,
  },
  {
    value: "componente-reutilizavel",
    label: "Componente Reutilizável (Front-End)",
    fileName: "componente-reutilizavel.txt",
    example: `Título: Componente StatusBadge: Badge de status customizado

Resumo:
Componente reutilizável para exibir badges coloridos de status em toda aplicação, garantindo consistência visual e reduzindo duplicação de código.

Assinatura de uso:
\`\`\`tsx
<StatusBadge status="active" />
<StatusBadge status="completed" text="Finalizado" />
\`\`\`
Props: status (required), text (optional), size (optional)

Onde está sendo usado:
- ProjectsDashboard (status de projetos)
- TasksList (status de tarefas)
- SprintCard (status de sprints)

Alterações futuras:
- Adicionar variante com ícones
- Suporte a tooltips explicativos
- Animação de pulse para status "em andamento"

Testes sugeridos:
- Renderização com todos status possíveis
- Verificar cores aplicadas corretamente
- Validar comportamento com/sem texto customizado`,
  },
  {
    value: "endpoint-api",
    label: "Endpoint / API (Back-End)",
    fileName: "endpoint-api.txt",
    example: `Título: Endpoint POST /api/projects

Resumo:
Endpoint para criação de novos projetos no sistema. Valida dados obrigatórios, verifica duplicação de nome e registra no banco de dados.

Request Body:
\`\`\`json
{
  "name": "Projeto Alpha",
  "description": "Descrição do projeto",
  "startDate": "2024-01-15",
  "endDate": "2024-12-31",
  "managerId": 123
}
\`\`\`

Response:
Sucesso (201):
\`\`\`json
{
  "id": 456,
  "name": "Projeto Alpha",
  "status": "active",
  "createdAt": "2024-01-10T10:00:00Z"
}
\`\`\`
Erro (400): { "error": "Nome do projeto já existe" }

Validações/Regras de negócio:
- Nome é obrigatório e único
- Data de fim deve ser posterior à data de início
- Manager deve existir e ter permissão
- Máximo de 50 projetos ativos por organização

Impacto:
- Tabela Projects recebe novo registro
- Notificação enviada ao manager via webhook
- Atualiza cache de projetos ativos

Como testar:
\`\`\`bash
curl -X POST http://localhost:3000/api/projects \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test Project","managerId":123,...}'
\`\`\`
Ou usar rota /projects no frontend para validação end-to-end.`,
  },
  {
    value: "migration",
    label: "Migration / Banco de Dados",
    fileName: "migration.txt",
    example: `Título: Migration: add_objective_to_periods

Resumo:
Adiciona coluna 'Objective' na tabela Periods para armazenar o objetivo/meta do período de planejamento.

Script Up:
\`\`\`sql
ALTER TABLE Periods
ADD COLUMN Objective NVARCHAR(500) NULL;

UPDATE Periods SET Objective = 'Objetivo não definido' WHERE Objective IS NULL;

ALTER TABLE Periods
ALTER COLUMN Objective NVARCHAR(500) NOT NULL;
\`\`\`

Script Down (rollback):
\`\`\`sql
ALTER TABLE Periods
DROP COLUMN Objective;
\`\`\`

Motivo da alteração:
Necessidade de documentar objetivos de cada período de planejamento para melhor rastreabilidade e alinhamento de equipes.

Impacto:
- Tabela Periods terá nova coluna obrigatória
- Queries existentes não quebram (coluna adicionada ao final)
- Aplicação precisa preencher Objective ao criar/editar períodos
- Relatórios podem incluir o campo Objective

Como testar:
1. Aplicar migration em ambiente de dev
2. Verificar coluna criada: SELECT TOP 1 * FROM Periods
3. Testar criação de novo período via API
4. Validar que rollback remove coluna corretamente`,
  },
  {
    value: "bugfix",
    label: "Bugfix",
    fileName: "bugfix.txt",
    example: `Título: Bugfix: Filtro de datas retornando períodos incorretos

Resumo:
Usuários reportaram que ao filtrar períodos por data, alguns registros fora do intervalo apareciam nos resultados. Isso causava confusão no planejamento e relatórios incorretos.

Causa raiz:
O filtro de data estava comparando strings ao invés de objetos Date, resultando em comparação lexicográfica incorreta. Datas no formato "DD/MM/YYYY" eram comparadas como texto.

Solução aplicada:
- Convertido filtros de data para objetos Date antes da comparação
- Implementado parse com date-fns para garantir timezone correto
- Adicionada validação de formato de entrada
Arquivo modificado: src/utils/dateRange.ts

Antes:
\`\`\`ts
if (period.startDate >= filterStart && period.endDate <= filterEnd)
\`\`\`

Depois:
\`\`\`ts
const start = parseISO(period.startDate);
const end = parseISO(period.endDate);
if (isWithinInterval(start, { start: filterStart, end: filterEnd }))
\`\`\`

Testes realizados:
- Testado filtro com datas em janeiro, fevereiro, dezembro
- Validado períodos que cruzam virada de ano
- Confirmado timezone UTC mantido em todo fluxo
- Regressão: outros filtros continuam funcionando

Pontos de atenção:
- Todas as datas devem ser ISO 8601 no backend
- Frontend deve usar date-fns para consistência
- Validar imports de parseISO em outros componentes`,
  },
  {
    value: "refatoracao",
    label: "Refatoração",
    fileName: "refatoracao.txt",
    example: `Título: Refatoração: Consolidação de hooks de Gantt

Resumo:
Consolidação de lógica duplicada de manipulação do Gantt espalhada em 3 componentes distintos em um único hook customizado, melhorando manutenibilidade e reduzindo código duplicado.

Antes:
Lógica de onDateChange, onProgressChange, onDelete duplicada em:
- src/app/projects/components/ProjectGantt.tsx
- src/app/sprints/components/SprintGantt.tsx  
- src/app/periods/components/PeriodGantt.tsx
Total: ~450 linhas de código duplicado

Depois:
Hook customizado useGanttHandlers concentra toda lógica:
- src/hooks/useGanttHandlers.ts (150 linhas)
Componentes agora apenas:
\`\`\`tsx
const { handleDateChange, handleProgressChange, handleDelete } = useGanttHandlers(tasks, setTasks);
\`\`\`

Benefícios:
- Redução de 66% no código relacionado a Gantt
- Facilita correções (bug fix em um lugar)
- Testes unitários centralizados no hook
- Melhor type safety com generics

Impacto:
Arquivos modificados:
- src/hooks/useGanttHandlers.ts (criado)
- src/app/projects/components/ProjectGantt.tsx (refatorado)
- src/app/sprints/components/SprintGantt.tsx (refatorado)
- src/app/periods/components/PeriodGantt.tsx (refatorado)

Validações:
- Testes unitários do hook: 12 casos passando
- Testes E2E de manipulação do Gantt: todos passando
- Performance: sem regressão (medida com React DevTools Profiler)
- Bundle size: redução de 3KB no build final`,
  },
  {
    value: "microservico",
    label: "Criação de Microserviço",
    fileName: "microservico.txt",
    example: `Título: Microserviço NotificationService

Resumo:
Serviço responsável por gerenciar envio de notificações (email, SMS, push) de forma assíncrona e escalável, desacoplando lógica de notificação do domínio principal.

Responsabilidades:
- Receber eventos de notificação via message broker
- Gerenciar templates de notificação
- Enviar notificações via provedores (SendGrid, Twilio, Firebase)
- Rastrear status de entrega e retentativas
- Expor endpoints de consulta de histórico

Arquitetura/Tecnologias:
- Framework: Node.js 20 + Express 4.18
- Banco de dados: PostgreSQL 15 (histórico) + Redis (cache/fila)
- Message broker: RabbitMQ 3.12
- Bibliotecas: SendGrid SDK, Twilio SDK, Firebase Admin SDK
- Containerização: Docker + Kubernetes

Comunicação:
- Consumidor: Fila RabbitMQ (exchange: notifications, routing: notification.*)
- REST API: GET /notifications/:userId (histórico), GET /health
- Publicador: Emite eventos notification.sent, notification.failed para auditoria

Eventos consumidos:
- user.created → Envia email de boas-vindas
- task.assigned → Notifica usuário atribuído
- sprint.completed → Notifica equipe

Deploy:
- Pipeline CI/CD: GitHub Actions
- Helm chart: deployments/notification-service/
- Ambientes: dev, staging, prod (auto-scaling habilitado)
- Secrets: gerenciados via Azure Key Vault

Testes:
- Unitários: Jest (cobertura 85%)
- Integração: Testcontainers (PostgreSQL + RabbitMQ)
- E2E: Testes de envio com provedores mockados
- Load test: K6 (500 notificações/seg suportadas)

Documentação adicional:
- Swagger: https://api.fanti.com/notification-service/docs
- Diagrama arquitetura: docs/architecture/notification-service.md
- Runbook: wiki/runbooks/notification-service.md
- Métricas: Grafana dashboard "Notification Service Overview"`,
  },
];

export default function TemplatesTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
    undefined
  );

  const currentTemplate = TEMPLATES.find((t) => t.value === selectedTemplate);

  const handleDownload = () => {
    if (!currentTemplate) return;

    const link = document.createElement("a");
    link.href = `/templates/${currentTemplate.fileName}`;
    link.download = currentTemplate.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={4}>Templates de Documentação de Tasks</Title>
            <Paragraph>
              Selecione o tipo de task para visualizar um exemplo preenchido e
              baixar o template em formato .txt para documentar suas entregas.
            </Paragraph>
          </div>

          <Select
            placeholder="Selecione o tipo de task..."
            style={{ width: "100%" }}
            size="large"
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            options={TEMPLATES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />

          {currentTemplate && (
            <>
              <Card
                type="inner"
                title="Exemplo Preenchido"
                extra={
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    Baixar Template (.txt)
                  </Button>
                }
              >
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  <Text>{currentTemplate.example}</Text>
                </pre>
              </Card>
            </>
          )}
        </Space>
      </Card>
    </Space>
  );
}

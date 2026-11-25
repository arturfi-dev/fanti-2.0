"use client";

import { BulbOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Alert, Card, Divider, Select, Space, Tag, Typography } from "antd";
import { useState } from "react";

const { Title, Paragraph, Text } = Typography;

interface TaskEstimate {
  value: string;
  label: string;
  storyPoints: number;
  refinedStory: string;
  taskBreakdown: string;
  justification: string;
  considerations: string[];
}

const TASK_ESTIMATES: TaskEstimate[] = [
  {
    value: "tela-frontend",
    label: "Task de Implementação de Tela (Front-End)",
    storyPoints: 5,
    refinedStory: `Como usuário, quero visualizar a lista de projetos ativos com filtros por status e data, para ter uma visão rápida do portfólio.

Critérios de Aceite:
- Dado que estou logado no sistema
- Quando acesso a rota /projects
- Então devo ver a lista de projetos em formato de tabela
- E posso filtrar por status (Ativo, Pausado, Concluído)
- E posso filtrar por período (data início/fim)
- E posso ordenar por nome, data de criação ou status`,
    taskBreakdown: `Título: Implementar tela de Dashboard de Projetos

Escopo técnico:
- Criar componente ProjectsDashboard.tsx
- Implementar tabela com Ant Design Table
- Adicionar filtros (Select para status, DatePicker para período)
- Integrar com API GET /api/projects
- Implementar ordenação e paginação
- Adicionar loading states e error handling
- Responsividade mobile`,
    justification: `5 Story Points porque:
• Complexidade Média: Envolve múltiplos componentes (tabela, filtros, paginação)
• Integração com API: Requer chamadas HTTP e tratamento de estados
• Lógica de filtros: Implementação de filtros combinados e ordenação
• UI/UX: Responsividade e estados de loading/erro
• Tempo estimado: 1-2 dias de desenvolvimento`,
    considerations: [
      "Se a API já existir e estiver documentada, mantém 5 SP",
      "Se precisar criar a API também, dividir em 2 tasks (Backend 3 SP + Frontend 5 SP)",
      "Adicionar testes automatizados pode aumentar para 8 SP",
      "Dashboard com gráficos complexos pode chegar a 8-13 SP",
    ],
  },
  {
    value: "componente-reutilizavel",
    label: "Componente Reutilizável (Front-End)",
    storyPoints: 3,
    refinedStory: `Como desenvolvedor, quero um componente StatusBadge reutilizável para exibir status de forma consistente em toda aplicação.

Critérios de Aceite:
- Dado que preciso exibir um status
- Quando uso <StatusBadge status="active" />
- Então devo ver um badge colorido conforme o status
- E as cores devem seguir o design system
- E deve suportar todos os status da aplicação (active, paused, completed, cancelled)
- E deve aceitar texto customizado opcional`,
    taskBreakdown: `Título: Criar componente StatusBadge reutilizável

Escopo técnico:
- Criar src/components/StatusBadge.tsx
- Definir interface de props (status, text?, size?)
- Implementar mapeamento de cores por status
- Adicionar variações de tamanho (small, default, large)
- Documentar props e exemplos de uso
- Integrar em 3 telas existentes (projetos, tasks, sprints)`,
    justification: `3 Story Points porque:
• Complexidade Baixa: Componente visual simples
• Reutilização: Precisa ser genérico e bem documentado
• Integração: Substituir badges existentes em múltiplas telas
• Tempo estimado: 0.5-1 dia de desenvolvimento`,
    considerations: [
      "Componente muito simples (só badge visual) pode ser 2 SP",
      "Se incluir animações ou interatividade complexa, sobe para 5 SP",
      "Adicionar Storybook para documentação pode aumentar 1-2 SP",
      "Componentes com muitas variantes e props podem chegar a 5 SP",
    ],
  },
  {
    value: "endpoint-api",
    label: "Endpoint / API (Back-End)",
    storyPoints: 5,
    refinedStory: `Como sistema, preciso de um endpoint para criar novos projetos, validando dados obrigatórios e regras de negócio.

Critérios de Aceite:
- Dado que envio um POST /api/projects com dados válidos
- Quando a requisição é processada
- Então o projeto deve ser criado no banco de dados
- E deve retornar status 201 com os dados do projeto
- E deve validar nome único (sem duplicatas)
- E deve validar que data fim > data início
- E deve validar que o manager existe e tem permissão
- E deve retornar erro 400 com mensagem clara em caso de validação falhar`,
    taskBreakdown: `Título: Criar endpoint POST /api/projects

Escopo técnico:
- Criar route handler em src/app/api/projects/route.ts
- Implementar validação de request body (Zod/Yup)
- Implementar regras de negócio (nome único, datas, permissões)
- Criar query no banco (INSERT com transaction)
- Implementar tratamento de erros
- Adicionar logs de auditoria
- Documentar contrato da API (Swagger/OpenAPI)`,
    justification: `5 Story Points porque:
• Complexidade Média-Alta: Múltiplas validações e regras de negócio
• Banco de dados: Transaction, validações de integridade
• Segurança: Validação de permissões e sanitização
• Erro handling: Múltiplos cenários de erro
• Tempo estimado: 1-2 dias de desenvolvimento`,
    considerations: [
      "Endpoint simples CRUD sem regras complexas pode ser 3 SP",
      "Se envolver múltiplas entidades ou lógica complexa, sobe para 8 SP",
      "Adicionar testes de integração pode aumentar 2 SP",
      "APIs com integrações externas (pagamento, email) podem ser 8-13 SP",
    ],
  },
  {
    value: "migration",
    label: "Migration / Banco de Dados",
    storyPoints: 3,
    refinedStory: `Como desenvolvedor, preciso adicionar o campo 'Objective' na tabela Periods para armazenar o objetivo do período.

Critérios de Aceite:
- Dado que executo a migration
- Quando aplico o script UP
- Então a coluna Objective deve ser criada como NVARCHAR(500) NOT NULL
- E registros existentes devem receber valor padrão
- E a aplicação deve conseguir ler/escrever o campo
- E o rollback (script DOWN) deve remover a coluna sem erros`,
    taskBreakdown: `Título: Migration add_objective_to_periods

Escopo técnico:
- Criar arquivo de migration (timestamp_add_objective.sql)
- Script UP: ALTER TABLE com ADD COLUMN
- UPDATE para popular registros existentes
- ALTER COLUMN para tornar NOT NULL
- Script DOWN: DROP COLUMN
- Testar em ambiente de dev
- Documentar impacto em queries existentes`,
    justification: `3 Story Points porque:
• Complexidade Baixa-Média: Alteração simples de schema
• Risco: Precisa de rollback seguro e testes
• Dados existentes: UPDATE para popular valores padrão
• Validação: Testar que não quebra queries existentes
• Tempo estimado: 0.5-1 dia (incluindo testes e validação)`,
    considerations: [
      "Migration muito simples (adicionar coluna nullable) pode ser 1 SP",
      "Se envolver dados complexos ou transformações, sobe para 5 SP",
      "Migrations com múltiplas tabelas relacionadas podem ser 5-8 SP",
      "Refatoração grande de schema (normalização) pode ser 13+ SP",
    ],
  },
  {
    value: "bugfix",
    label: "Bugfix",
    storyPoints: 3,
    refinedStory: `Como usuário, encontro resultados incorretos ao filtrar períodos por data, recebendo registros fora do intervalo selecionado.

Critérios de Aceite:
- Dado que filtro períodos entre 01/01/2024 e 31/01/2024
- Quando aplico o filtro
- Então devo ver APENAS períodos dentro desse intervalo
- E não devem aparecer períodos de outros meses
- E o filtro deve respeitar timezone UTC
- E deve funcionar corretamente na virada de ano`,
    taskBreakdown: `Título: Corrigir filtro de datas em períodos

Escopo técnico:
- Investigar causa raiz (comparação de strings vs Date)
- Refatorar src/utils/dateRange.ts
- Substituir comparação lexicográfica por parseISO + isWithinInterval
- Adicionar validação de formato de entrada
- Garantir timezone consistente (UTC)
- Testar casos edge (virada de ano, meses diferentes)
- Validar que não quebrou outras funcionalidades`,
    justification: `3 Story Points porque:
• Complexidade Média: Requer investigação + correção
• Escopo limitado: Bug específico, solução pontual
• Testes necessários: Validar edge cases e regressão
• Risco baixo: Alteração em função isolada
• Tempo estimado: 0.5-1 dia (incluindo investigação e testes)`,
    considerations: [
      "Bug trivial (typo, correção simples) pode ser 1 SP",
      "Bug complexo que afeta múltiplos módulos pode ser 5-8 SP",
      "Se requer refatoração significativa, considerar como nova feature",
      "Bugs críticos de produção podem ter priority boost mas SP mantém realista",
    ],
  },
  {
    value: "refatoracao",
    label: "Refatoração",
    storyPoints: 8,
    refinedStory: `Como desenvolvedor, preciso consolidar lógica duplicada de Gantt em um hook customizado para melhorar manutenibilidade.

Critérios de Aceite:
- Dado que tenho código duplicado em 3 componentes de Gantt
- Quando crio o hook useGanttHandlers
- Então a lógica deve estar centralizada em um único lugar
- E os 3 componentes devem usar o hook sem duplicação
- E todos os testes existentes devem continuar passando
- E não deve haver regressão de funcionalidade
- E deve reduzir pelo menos 50% do código relacionado`,
    taskBreakdown: `Título: Refatorar lógica de Gantt para hook customizado

Escopo técnico:
- Criar src/hooks/useGanttHandlers.ts
- Extrair handlers (onDateChange, onProgressChange, onDelete)
- Implementar com generics para type safety
- Refatorar ProjectGantt.tsx para usar o hook
- Refatorar SprintGantt.tsx para usar o hook
- Refatorar PeriodGantt.tsx para usar o hook
- Criar testes unitários do hook
- Executar testes E2E de regressão
- Medir impacto no bundle size`,
    justification: `8 Story Points porque:
• Complexidade Alta: Múltiplos componentes afetados
• Escopo amplo: Extração, generalização e integração
• Testes críticos: Regressão em funcionalidade core
• Type safety: Implementar com TypeScript generics
• Validação: Comparar performance antes/depois
• Tempo estimado: 2-3 dias de desenvolvimento`,
    considerations: [
      "Refatoração pequena (renomear, reorganizar) pode ser 2-3 SP",
      "Refatoração sem testes de regressão é arriscada, adicionar 2-3 SP para testes",
      "Refatoração arquitetural grande (migrar state management) pode ser 13+ SP",
      "Sempre validar que não há regressão funcional ou de performance",
    ],
  },
  {
    value: "microservico",
    label: "Criação de Microserviço",
    storyPoints: 21,
    refinedStory: `Como arquiteto, preciso criar um microserviço de notificações para desacoplar envio de emails/SMS/push do domínio principal.

Critérios de Aceite:
- Dado que um evento de notificação é publicado
- Quando o serviço consome o evento
- Então deve enviar notificação via provedor apropriado (email/SMS/push)
- E deve registrar histórico de envio
- E deve implementar retry em caso de falha
- E deve expor API para consultar histórico
- E deve ter health check e métricas
- E deve ser deployável via Kubernetes
- E deve ter documentação completa (Swagger, arquitetura, runbook)`,
    taskBreakdown: `Título: Criar microserviço NotificationService

Escopo técnico:
- Setup inicial: Node.js + Express + TypeScript
- Configurar banco (PostgreSQL) + cache (Redis)
- Implementar consumidor RabbitMQ
- Integrar provedores (SendGrid, Twilio, Firebase)
- Criar endpoints REST (/notifications/:userId, /health)
- Implementar sistema de retry e dead letter queue
- Configurar logs estruturados e métricas (Prometheus)
- Criar Dockerfile + Helm charts
- Setup CI/CD pipeline
- Testes: unitários, integração, E2E, load testing
- Documentação: Swagger, diagramas, runbook`,
    justification: `21 Story Points porque:
• Complexidade Muito Alta: Sistema completo do zero
• Múltiplas integrações: RabbitMQ, 3 provedores externos, banco
• Infraestrutura: Docker, K8s, CI/CD, observabilidade
• Qualidade: Testes em múltiplas camadas, documentação completa
• Resiliência: Retry, DLQ, health checks, monitoring
• Tempo estimado: 3-4 semanas de desenvolvimento
• Equipe: Provavelmente requer 2+ desenvolvedores`,
    considerations: [
      "Microserviço simples (CRUD básico) pode ser 8-13 SP",
      "Considerar dividir em múltiplos épicos/stories se possível",
      "Tasks acima de 13 SP geralmente indicam que devem ser quebradas",
      "Para 21 SP, considerar: MVP (8 SP) + Integrações (5 SP) + Observabilidade (5 SP) + Deploy (3 SP)",
    ],
  },
];

export default function StoryPointsTab() {
  const [selectedTask, setSelectedTask] = useState<string | undefined>(
    undefined
  );

  const currentTask = TASK_ESTIMATES.find((t) => t.value === selectedTask);

  const getComplexityColor = (sp: number): string => {
    if (sp <= 2) return "green";
    if (sp <= 5) return "blue";
    if (sp <= 8) return "orange";
    return "red";
  };

  const getComplexityLabel = (sp: number): string => {
    if (sp <= 2) return "Simples";
    if (sp <= 5) return "Média";
    if (sp <= 8) return "Alta";
    return "Muito Alta";
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={4}>Estimativa de Story Points por Tipo de Task</Title>
            <Paragraph>
              Veja como transformar uma história refinada em task técnica com
              estimativa de Story Points. Entenda o escopo, complexidade e
              justificativa para cada tipo de trabalho.
            </Paragraph>
            <Alert
              type="info"
              message="O que são Story Points?"
              description="Story Points medem esforço, complexidade e incerteza - não tempo direto. A escala comum é Fibonacci: 1, 2, 3, 5, 8, 13, 21. Valores acima de 13 geralmente indicam que a história deve ser dividida."
              showIcon
              style={{ marginBottom: 16 }}
            />
          </div>

          <Select
            placeholder="Selecione o tipo de task..."
            style={{ width: "100%" }}
            size="large"
            value={selectedTask}
            onChange={setSelectedTask}
            options={TASK_ESTIMATES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />

          {currentTask && (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Card
                type="inner"
                title={
                  <Space>
                    <BulbOutlined />
                    <span>Estimativa</span>
                    <Tag
                      color={getComplexityColor(currentTask.storyPoints)}
                      style={{ marginLeft: 8 }}
                    >
                      {currentTask.storyPoints} SP - Complexidade{" "}
                      {getComplexityLabel(currentTask.storyPoints)}
                    </Tag>
                  </Space>
                }
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      📖 História Refinada (Product Owner)
                    </Text>
                    <Card
                      style={{
                        marginTop: 8,
                        backgroundColor: "#f6f8fa",
                        border: "1px solid #e1e4e8",
                      }}
                    >
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          fontFamily: "monospace",
                          fontSize: "13px",
                          margin: 0,
                        }}
                      >
                        {currentTask.refinedStory}
                      </pre>
                    </Card>
                  </div>

                  <Divider style={{ margin: "8px 0" }} />

                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      🔧 Task Técnica (Desenvolvedor)
                    </Text>
                    <Card
                      style={{
                        marginTop: 8,
                        backgroundColor: "#fffbeb",
                        border: "1px solid #fcd34d",
                      }}
                    >
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          fontFamily: "monospace",
                          fontSize: "13px",
                          margin: 0,
                        }}
                      >
                        {currentTask.taskBreakdown}
                      </pre>
                    </Card>
                  </div>

                  <Divider style={{ margin: "8px 0" }} />

                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      <ThunderboltOutlined /> Por que {currentTask.storyPoints}{" "}
                      Story Points?
                    </Text>
                    <Card
                      style={{
                        marginTop: 8,
                        backgroundColor: "#ecfdf5",
                        border: "1px solid #6ee7b7",
                      }}
                    >
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          fontFamily: "monospace",
                          fontSize: "13px",
                          margin: 0,
                        }}
                      >
                        {currentTask.justification}
                      </pre>
                    </Card>
                  </div>

                  <Alert
                    type="warning"
                    message="⚖️ Considerações para ajustar a estimativa"
                    description={
                      <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                        {currentTask.considerations.map((consideration, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    }
                    showIcon
                  />
                </Space>
              </Card>
            </Space>
          )}
        </Space>
      </Card>

      {!selectedTask && (
        <Card>
          <Title level={5}>💡 Dicas para Estimativa</Title>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text>
              <strong>1 SP:</strong> Tarefa trivial (correção de typo, ajuste
              de CSS simples) - 1-2 horas
            </Text>
            <Text>
              <strong>2 SP:</strong> Tarefa simples (componente visual básico,
              ajuste de validação) - meio dia
            </Text>
            <Text>
              <strong>3 SP:</strong> Tarefa pequena (bug fix, migration
              simples, componente reutilizável) - 1 dia
            </Text>
            <Text>
              <strong>5 SP:</strong> Tarefa média (tela com CRUD, endpoint com
              regras, integração) - 1-2 dias
            </Text>
            <Text>
              <strong>8 SP:</strong> Tarefa complexa (refatoração grande,
              múltiplas integrações) - 2-3 dias
            </Text>
            <Text>
              <strong>13 SP:</strong> Tarefa muito complexa (feature completa,
              módulo novo) - 1 semana
            </Text>
            <Text>
              <strong>21+ SP:</strong> Épico - deve ser dividido em histórias
              menores
            </Text>
            <Divider style={{ margin: "12px 0" }} />
            <Alert
              type="success"
              message="Lembre-se: Story Points são relativos à sua equipe"
              description="O que é 5 SP para uma equipe pode ser 3 SP para outra. Use histórias anteriores como referência e ajuste com base na experiência do time."
              showIcon
            />
          </Space>
        </Card>
      )}
    </Space>
  );
}

"use client";

import { Alert, Card, Space, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function EpicHelper() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Title level={3}>🎯 O que é um Épico?</Title>
        <Paragraph>
          Um <strong>Épico</strong> é uma solicitação ampla, grande demais para ser entregue em uma única sprint.
          Ele descreve uma <strong>visão macro</strong> de valor, mas não detalha como será executado.
        </Paragraph>
        <Alert
          type="warning"
          message="Exemplos de Épicos"
          description={
            <>
              • "Criar uma tela com CRUD completo"<br />
              • "Implementar módulo de Relatórios"<br />
              • "Desenvolver dashboard com filtros, gráficos e exportações"<br />
              • "Sistema de notificações por email e push"
            </>
          }
          showIcon
        />
      </Card>

      <Card>
        <Title level={3}>📋 Como dividir um Épico em User Stories?</Title>
        <Paragraph>
          Para transformar um épico em histórias entregáveis, siga estas etapas:
        </Paragraph>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card type="inner" title="1️⃣ Identifique o valor incremental">
            <Paragraph>
              Quebre o épico em <strong>pequenas entregas</strong> que geram valor sozinhas.
              Pergunte-se: "O usuário consegue usar essa parte isoladamente?"
            </Paragraph>
            <Text type="secondary">
              Exemplo: Ao invés de "CRUD completo", pense em "listar projetos", "criar projeto", etc.
            </Text>
          </Card>

          <Card type="inner" title="2️⃣ Separe Backend e Frontend">
            <Paragraph>
              <strong>Backend primeiro:</strong> Crie a modelagem, regras de negócio e APIs antes de iniciar o frontend.
              Isso permite validação independente e paralelização do trabalho.
            </Paragraph>
            <Text type="secondary">
              Story 1: "Criar endpoint POST /projects"<br />
              Story 2: "Implementar tela de cadastro de projetos"
            </Text>
          </Card>

          <Card type="inner" title="3️⃣ Siga a ordem recomendada (CRUD)">
            <Paragraph>
              <strong>Ordem ideal para CRUDs:</strong>
            </Paragraph>
            <ol style={{ paddingLeft: 20 }}>
              <li><strong>Modelagem e API Backend</strong> — Define entidade, validações e endpoints</li>
              <li><strong>Tela de Listagem (Index)</strong> — Consome GET, valida o backend</li>
              <li><strong>Tela de Criação (Create)</strong> — Implementa fluxo de inserção</li>
              <li><strong>Tela de Edição (Edit)</strong> — Reutiliza lógica do Create</li>
              <li><strong>Tela de Exclusão (Delete)</strong> — Conclui o ciclo</li>
            </ol>
          </Card>

          <Card type="inner" title="4️⃣ Use critérios de aceite claros">
            <Paragraph>
              Cada história deve ter <strong>critérios testáveis</strong>:
            </Paragraph>
            <ul style={{ paddingLeft: 20 }}>
              <li>Dado [contexto inicial]</li>
              <li>Quando [ação do usuário]</li>
              <li>Então [resultado esperado]</li>
            </ul>
            <Text type="secondary">
              Exemplo: "Dado que estou na tela de projetos, quando clico em 'Novo Projeto', então devo ver o formulário de cadastro"
            </Text>
          </Card>
        </Space>
      </Card>
    </Space>
  );
}


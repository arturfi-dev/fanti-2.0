"use client";

import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Input, Space, Typography, message } from 'antd';
import { useMemo, useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Como escrever uma boa User Story?',
    answer:
      "Use o formato 'Como um [perfil], eu quero [ação] para que [benefício]'. Mantenha foco no usuário e no valor gerado. Evite descrições técnicas e garanta que a história seja pequena o suficiente para ser entregue em um sprint.",
  },
  {
    question: 'Como definir critérios de aceitação?',
    answer:
      'Critérios de aceitação devem ser claros, objetivos e testáveis. Liste comportamentos esperados usando Given/When/Then quando fizer sentido. Garanta que cubram exceções e fluxos alternativos.',
  },
  {
    question: 'Qual o nível de detalhe ideal?',
    answer:
      'Inclua a finalidade, regras de negócio relevantes, exceções, dependências e critérios de aceitação. Não descreva solução técnica. Garanta clareza suficiente para estimar e implementar.',
  },
  {
    question: 'Como dividir histórias grandes?',
    answer:
      'Divida por fluxo de usuário, regra de negócio, exceção, caminho crítico, ou vertical slice. Cada história deve entregar valor e ser testável isoladamente.',
  },
  {
    question: 'Como transformar solicitações em histórias?',
    answer:
      'Leia a demanda e identifique: quem é o usuário, qual é a ação e qual é o benefício. Evite transformar pedidos extensos em histórias gigantes; quebre conforme necessário.',
  },
  {
    question: 'Como identificar quando algo não é uma User Story?',
    answer:
      'Se o texto descreve tarefas técnicas, passos de desenvolvimento ou detalhes de código, provavelmente é uma task. User Stories devem sempre refletir comportamento do usuário e valor de negócio.',
  },
  {
    question: 'Como escrever histórias a partir dos exemplos enviados?',
    answer:
      `Exemplo 1 (melhorado):\nComo usuário do sistema de projetos, eu quero salvar um projeto preenchendo apenas o campo Nome do Projeto, para que eu possa registrar rascunhos rapidamente.\n\nCritérios de aceitação:\n- Nome do Projeto é obrigatório.\n- Demais campos são opcionais.\n- O sistema deve permitir salvar o projeto mesmo com apenas o nome preenchido.\n- Exibir mensagem de sucesso após salvar.`,
  },
  {
    question: 'Exemplo prático baseado na aba "Outros Dispêndios"?',
    answer:
      `Exemplo 2 (melhorado):\nComo gestor de dispêndios, eu quero registrar e gerenciar outros dispêndios seguindo o mesmo padrão das abas existentes, para manter consistência e facilitar o controle.\n\nCritérios de aceitação:\n- Permitir inserir, editar, excluir (individual e massivo) dispêndios.\n- Permitir upload e download de Excel.\n- Exibir colunas: Tipologia, CNPJ Associado, Fornecedor, CNPJ, Descrição, Quantidade, Justificativa, Nome do Projeto, Macro Etapa, Tipo de Apropriação, Conta Contábil, Controle Gerencial, Nº Rastreio, Data de Contabilização, Valor do Dispêndio, Observações.\n- Aplicar obrigatoriedade conforme tabela enviada.\n- Layout deve seguir o padrão ATUAL.`,
  },
];

export default function StoryTab() {
  const [q, setQ] = useState('');
  // Template form state
  const [profile, setProfile] = useState('');
  const [action, setAction] = useState('');
  const [benefit, setBenefit] = useState('');
  const [generated, setGenerated] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(item =>
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    );
  }, [q]);

  return (
    <div style={{ padding: 24 }}>
        <Title level={3}>Guia para escrever boas User Stories</Title>

        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <Paragraph>
            Use o template padrão para treinar: <Text code>Como um [perfil], eu quero [ação] para que [benefício]</Text>
          </Paragraph>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder="Perfil (ex: usuário do sistema)" value={profile} onChange={(e) => setProfile(e.target.value)} />
            <Input placeholder="Ação (ex: salvar um projeto rapidamente)" value={action} onChange={(e) => setAction(e.target.value)} />
            <Input placeholder="Benefício (ex: registrar rascunhos)" value={benefit} onChange={(e) => setBenefit(e.target.value)} />
            <Space>
              <Button type="primary" onClick={() => {
                const story = `Como um ${profile || '[perfil]'}, eu quero ${action || '[ação]'} para que ${benefit || '[benefício]'}`;
                setGenerated(story);
              }}>Gerar história</Button>
              <Button onClick={() => { setProfile(''); setAction(''); setBenefit(''); setGenerated(''); }}>Limpar</Button>
              <Button onClick={async () => {
                try {
                  await navigator.clipboard.writeText(generated);
                  message.success('Texto copiado para a área de transferência');
                } catch (e) {
                  message.error('Não foi possível copiar');
                }
              }} disabled={!generated}>Copiar</Button>
            </Space>

            {generated && (
              <Card type="inner">
                <Text style={{ whiteSpace: 'pre-wrap' }}>{generated}</Text>
              </Card>
            )}
          </Space>
        </div>

        <Collapse
          accordion
        >
          {filtered.map((item) => (
            <Panel header={item.question} key={item.question}>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{item.answer}</Text>
            </Panel>
          ))}
        </Collapse>


    </div>
  );
}

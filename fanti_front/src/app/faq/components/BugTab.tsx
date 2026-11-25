"use client";

import { Button, Card, Collapse, Input, Select, Space, Typography, message } from 'antd';
import { useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const BUG_FAQ: { question: string; answer: string }[] = [
  {
    question: 'Quais informações são essenciais em um bug?',
    answer: 'Inclua título curto, passos para reproduzir, resultado esperado, resultado atual, severidade, versão do sistema e anexos (logs/screenshot). Sem essas informações o diagnóstico fica lento.'
  },
  {
    question: 'Como escrever passos para reproduzir?',
    answer: 'Descreva passos mínimos e determinísticos: 1) vá para X; 2) clique em Y; 3) preencha Z; 4) observe o erro. Evite passos condicionais ou ambíguos.'
  },
  {
    question: 'O que é severidade e como definir?',
    answer: 'Severidade é o impacto do bug: Critical (bloqueia uso), High (quebra funcionalidade importante), Medium (impacta um fluxo secundário), Low (cosmético). Use com parcimônia.'
  },
  {
    question: 'Como ajudar os desenvolvedores?',
    answer: 'Anexe logs, prints, passo-a-passo e infos do ambiente (browser, versão, plataforma). Indique se o problema é reproduzível sempre ou intermitente.'
  }
];

export default function BugTab() {
  const [bugSteps, setBugSteps] = useState('');
  const [bugExpected, setBugExpected] = useState('');
  const [bugActual, setBugActual] = useState('');
  const [bugEnvironment, setBugEnvironment] = useState('');
  const [bugGenerated, setBugGenerated] = useState('');

  return (
    <div style={{ padding: 24 }}>
        <Title level={3} style={{ marginTop: 12 }}>Guia para relatar um Bug</Title>
        <Paragraph>
          Este guia ajuda usuários a escrever bugs claros, concisos e alinhados às melhores práticas do mercado.
        </Paragraph>

        <Input.TextArea
          placeholder="Passos para reproduzir (um por linha)"
          value={bugSteps}
          onChange={(e) => setBugSteps(e.target.value)}
          rows={4}
          style={{ marginBottom: 12 }}
        />

        <Input.TextArea
          placeholder="Resultado esperado"
          value={bugExpected}
          onChange={(e) => setBugExpected(e.target.value)}
          rows={2}
          style={{ marginBottom: 12 }}
        />

        <Input.TextArea
          placeholder="Resultado atual"
          value={bugActual}
          onChange={(e) => setBugActual(e.target.value)}
          rows={2}
          style={{ marginBottom: 12 }}
        />

        <div style={{ marginTop: 16 }}>
          <Space>
            <Button type="primary" onClick={() => {
              const template = `Passos:\n${bugSteps || '- [descreva os passos]'}\n\nEsperado:\n${bugExpected || '[resultado esperado]'}\n\nAtual:\n${bugActual || '[resultado atual]'}\n\nAmbiente: ${bugEnvironment || '[ambiente]'}\n\nAnexos: [logs/screenshots]`;
              setBugGenerated(template);
            }}>Gerar Bug</Button>
            <Button onClick={() => { setBugSteps(''); setBugExpected(''); setBugActual(''); setBugEnvironment(''); setBugGenerated(''); }}>Limpar</Button>
            <Button onClick={async () => {
              try {
                await navigator.clipboard.writeText(bugGenerated);
                message.success('Bug copiado para a área de transferência');
              } catch (e) {
                message.error('Não foi possível copiar');
              }
            }} disabled={!bugGenerated}>Copiar</Button>
          </Space>
        </div>

        {bugGenerated && (
          <Card type="inner" style={{ marginTop: 12 }}>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{bugGenerated}</Text>
          </Card>
        )}

        <Collapse style={{marginTop: 16}}>
          {BUG_FAQ.map((item) => (
            <Panel header={item.question} key={item.question}>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{item.answer}</Text>
            </Panel>
          ))}
        </Collapse>
    </div>
  );
}

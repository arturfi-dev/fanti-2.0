"use client";
import { CalendarOutlined, CheckCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Col, Collapse, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PeriodDetails from './components/PeriodDetails';
import PeriodOrganization from './components/PeriodOrganization';
// Controla abertura pendente do modal e o tipo (view/org)
import { useModals } from '../../hooks/useModals';
import { useOrganization } from '../../hooks/useOrganization';
import { Period, PeriodStaff, Project, Staff, TasksPeriod, Team } from '../../types';

const { Text } = Typography;
const { Option } = Select;

export default function PeriodsPage() {
  const { message } = App.useApp();

  // Data states
  const [pendingModal, setPendingModal] = useState<{ type: 'view' | 'org', period: Period | null } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [periodStaffs, setPeriodStaffs] = useState<PeriodStaff[]>([]);
  const [tasksPeriod, setTasksPeriod] = useState<TasksPeriod[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data?.data || []);
    } catch {
      message.error('Erro ao carregar projetos');
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Form and search
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // View state for transitions
  const [organizingPeriod, setOrganizingPeriod] = useState<Period | null>(null);

  // Lessons learned modal states
  const [lessonsModal, setLessonsModal] = useState(false);
  const [selectedPeriodForLessons, setSelectedPeriodForLessons] = useState<Period | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(undefined);
  const [lessonsForm] = Form.useForm();
  const [savingLessons, setSavingLessons] = useState(false);

  // Code review status modal states
  const [reviewStatusModal, setReviewStatusModal] = useState(false);
  const [selectedPeriodForReview, setSelectedPeriodForReview] = useState<Period | null>(null);

  // Custom hooks
  const modalsHook = useModals();
  const organizationHook = useOrganization(
    periodStaffs,
    tasksPeriod,
    message,
    modalsHook.modalData.organizingPeriod || undefined,
    () => {
      // Refresh data after organization changes
      fetchPeriodStaffs();
      fetchTasksPeriod();
    }
  );

  // Utility functions
  const getTaskColor = useCallback((hours: number) => {
    if (hours < 8) return 'blue';
    if (hours <= 40) return 'orange';
    return 'red';
  }, []);

  // Calculate current week
  const currentWeek = useMemo(() => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }, []);

  // Fetch functions
  const fetchStaffs = useCallback(async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      setStaffs(data?.data || []);
    } catch {
      message.error('Erro ao carregar colaboradores');
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      setTeams(data?.data || []);
    } catch {
      message.error('Erro ao carregar equipes');
    }
  }, []);

  const fetchPeriodStaffs = useCallback(async () => {
    try {
      const res = await fetch('/api/periodStaff');
      const data = await res.json();
      setPeriodStaffs(data?.data || []);
    } catch {
      message.error('Erro ao carregar relacionamentos de período');
    }
  }, []);

  const fetchTasksPeriod = useCallback(async () => {
    try {
      const res = await fetch('/api/tasksPeriod');
      const data = await res.json();
      setTasksPeriod(data?.data || []);
    } catch {
      message.error('Erro ao carregar tarefas do período');
    }
  }, []);

  // Centralized data refresh function
  const refreshAllData = useCallback(async () => {
    setRefreshing(true);
    await fetchStaffs();
    await fetchTeams();
    await fetchPeriodStaffs();
    await fetchTasksPeriod();
    await fetchProjects();
    await fetchPeriods(); // Ensure periods are loaded last with all dependencies
    setRefreshing(false);
  }, []); // Remove dependencies to avoid circular reference

  const fetchPeriods = useCallback(async () => {
    if (staffs.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/periods');
      const data = await res.json();

      // Join staffs by PeriodStaff relationship
      const periodsWithStaffs = (data?.data || []).map((period: Period) => {
        const relatedStaffIds = periodStaffs.filter(ps => ps.periodId === period.id).map(ps => ps.staffId);
        const staffsList = relatedStaffIds.map(id => staffs.find(s => s.id === id)).filter(Boolean);
        return { ...period, staffs: staffsList };
      });
      setPeriods(periodsWithStaffs);
    } catch (error) {
      message.error('Erro ao carregar períodos');
    } finally {
      setLoading(false);
    }
  }, [staffs, periodStaffs, message]); // Need to include dependencies for the join logic

  // Effects
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchStaffs(),
        fetchTeams(),
        fetchPeriodStaffs(),
        fetchTasksPeriod(),
        fetchProjects()
      ]);
      setInitialDataLoaded(true);
    };
    loadInitialData();
  }, []); // Execute only once on mount

  useEffect(() => {
    // Only fetch periods after initial data is loaded and we have staffs
    if (initialDataLoaded && staffs.length > 0 && periods.length === 0) {
      fetchPeriods();
    }
  }, [initialDataLoaded, staffs.length, periods.length]); // Include periods.length to prevent re-execution

  const handleCreate = useCallback(() => {
    modalsHook.openCreateModal();
    form.resetFields();
  }, [modalsHook, form]);

  const handleEdit = useCallback((period: Period) => {
    const staffIds = periodStaffs.filter(ps => ps.periodId === period.id).map(ps => ps.staffId);
    modalsHook.openEditModal(period);
    form.setFieldsValue({
      name: period.name,
      objective: (period as any).objective ?? (period as any).Objective ?? '',
      staffIds: staffIds,
      dateRange: period.startDate && period.endDate ? [dayjs(period.startDate), dayjs(period.endDate)] : undefined
    });
  }, [periodStaffs, form, modalsHook]);

  const handleView = useCallback(async (period: Period) => {
    setPendingModal({ type: 'view', period });
    await refreshAllData();
  }, [refreshAllData]);

  const handleOrg = useCallback(async (period: Period) => {
    setPendingModal({ type: 'org', period });
    await refreshAllData();
  }, [refreshAllData]);

  const handleLessons = useCallback(async (period: Period) => {
    setSelectedPeriodForLessons(period);
    setSelectedStaffId(undefined);
    lessonsForm.resetFields();
    // Refresh tasksPeriod to get latest data from backend
    await fetchTasksPeriod();
    setLessonsModal(true);
  }, [lessonsForm, fetchTasksPeriod]);

  const handleReviewStatus = useCallback(async (period: Period) => {
    setSelectedPeriodForReview(period);
    await fetchTasksPeriod();
    await fetchPeriodStaffs();
    setReviewStatusModal(true);
  }, [fetchTasksPeriod, fetchPeriodStaffs]);
  // Efeito para abrir o modal só após refreshAllData e atualização dos estados
  useEffect(() => {
    if (!pendingModal || refreshing) return;
    const { type, period } = pendingModal;
    if (!period) return;
    const updatedPeriod = periods.find((p: Period) => p.id === period.id);
    if (updatedPeriod) {
      const relatedStaffIds = periodStaffs.filter(ps => ps.periodId === updatedPeriod.id).map(ps => ps.staffId);
      const staffsList = relatedStaffIds
        .map(id => staffs.find(s => s.id === id))
        .filter((s): s is Staff => Boolean(s));
      const periodWithStaffs = { ...updatedPeriod, staffs: staffsList };
      if (type === 'view') {
        modalsHook.openViewModal(periodWithStaffs);
      } else {
        setOrganizingPeriod(periodWithStaffs);
        organizationHook.initializeOrgData(periodWithStaffs);
        modalsHook.openOrganizationModal(periodWithStaffs);
      }
    } else {
      if (type === 'view') {
        modalsHook.openViewModal(period);
      } else {
        setOrganizingPeriod(period);
        organizationHook.initializeOrgData(period);
        modalsHook.openOrganizationModal(period);
      }
    }
    setPendingModal(null);
  }, [pendingModal, periods, staffs, periodStaffs, modalsHook, organizationHook]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/periods?id=${id}`, { method: 'DELETE' });
      message.success('Período removido!');
      fetchPeriods();
    } catch {
      message.error('Erro ao remover período');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const startDate = values.dateRange ? dayjs(values.dateRange[0]) : dayjs();
      const endDate = values.dateRange ? dayjs(values.dateRange[1]) : dayjs().add(1, 'day');
      const duration = endDate.diff(startDate, 'day');
      const basePayload = {
        Name: values.name,
        Staffs: values.staffIds || [],
        Objective: values.objective || '',
        StartDate: startDate.toISOString(),
        EndDate: endDate.toISOString(),
      };
      const payload = modalsHook.modalData.editingPeriod ? basePayload : { ...basePayload, Duration: duration };
      if (modalsHook.modalData.editingPeriod) {
        const response = await fetch(`/api/periods`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, Id: modalsHook.modalData.editingPeriod.id })
        });
        const updated = await response.json();
        message.success('Período atualizado!');
        setPeriods(prev =>
          prev.map(p =>
            modalsHook.modalData.editingPeriod && p.id === modalsHook.modalData.editingPeriod.id
              ? { ...p, ...updated.data }
              : p
          )
        );
        // Also update in modal view state if present
      } else {
        const response = await fetch(`/api/periods`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const newPeriod = await response.json();
        message.success('Período criado!');

        // Add the new period directly to the state
        setPeriods(prev => [...prev, newPeriod.data || newPeriod]);
      }
      modalsHook.closeModal('createEdit');

      form.resetFields();
    } catch {
      message.error('Erro ao salvar período');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    modalsHook.closeModal('createEdit');
  }, [form, modalsHook]);

  const updateTotalHours = (staffId: string, value: number) => organizationHook.updateTotalHours(staffId, value, organizingPeriod!);
  const addTask = (staffId: string) => organizationHook.addTask(staffId, organizingPeriod!);
  const removeTask = organizationHook.removeTask;

  // Filtered periods
  const filteredPeriods = useMemo(() => {
    return periods.filter(period => {
      const matchesSearch = !searchText || period.name.toLowerCase().includes(searchText.toLowerCase());
      return matchesSearch;
    });
  }, [periods, searchText]);

  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name', render: (text: string) => <span><CalendarOutlined /> {text}</span> },
    {
      title: 'Objetivo', dataIndex: 'objective', key: 'objective', width: 360, render: (obj: string, record: any) => {
        const text = obj ?? record.Objective ?? '';
        if (!text) return '-';
        const display = text.length > 120 ? text.slice(0, 120) + '...' : text;
        return (
          <Tooltip title={text}>
            <span>{display}</span>
          </Tooltip>
        );
      }
    },
    { title: 'Início', dataIndex: 'startDate', key: 'startDate', render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    { title: 'Fim', dataIndex: 'endDate', key: 'endDate', render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY') : '-' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, period: Period) => (
        <Space>
          <Tooltip title="Visualizar">
            <Button icon={<EyeOutlined />} onClick={() => handleView(period)} />
          </Tooltip>
          <Tooltip title="Organizar">
            <Button icon={<LineChartOutlined />} onClick={() => handleOrg(period)} />
          </Tooltip>
          <Tooltip title="Lições Aprendidas">
            <Button icon={<FileTextOutlined />} onClick={() => handleLessons(period)} />
          </Tooltip>
          <Tooltip title="Status de Revisão">
            <Button icon={<CheckCircleOutlined />} onClick={() => handleReviewStatus(period)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(period)} />
          </Tooltip>
          <Popconfirm title="Remover período?" onConfirm={() => handleDelete(period.id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header com filtros */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8} lg={8}>
            <Input
              placeholder="Buscar períodos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ borderColor: '#d9d9d9' }}
            />
          </Col>
          <Col xs={24} sm={24} md={16} lg={16}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{ borderColor: '#d9d9d9' }}
              >
                Novo Período
              </Button>
              <Button
                onClick={() => setSearchText('')}
                style={{ borderColor: '#d9d9d9' }}
              >
                Limpar
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Criação de Período */}
      <Card>
        <Table columns={columns} dataSource={filteredPeriods} rowKey="id" loading={loading} />
      </Card>
      <Modal
        title={modalsHook.modalData.editingPeriod ? 'Editar Período' : 'Novo Período'}
        open={modalsHook.modals.createEdit}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
          <Text style={{ fontSize: 12, color: '#52c41a' }}>
            💡 <strong>Dica:</strong> Você pode selecionar vários colaboradores e definir o período usando o calendário.
          </Text>
        </div>
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 6 }}>
          <Text style={{ fontSize: 14, color: '#1890ff' }}>
            📅 <strong>Estamos na semana: {currentWeek}</strong>
          </Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Nome do Período"
            rules={[{ required: true, message: 'Por favor, insira o nome do período' }]}
          >
            <Input placeholder="Ex: Sprint 1" />
          </Form.Item>
          <Form.Item
            name="objective"
            label="Objetivo"
            rules={[{ required: true, message: 'Por favor, insira o objetivo do período' }]}>
            <Input.TextArea placeholder="Descreva o objetivo do período (ex: alinhamento de equipe para entrega do Epic X)" rows={2} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Período"
            rules={[{ required: true, message: 'Selecione o período' }]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder={['Data de início', 'Data de fim']}
            />
          </Form.Item>
          <Form.Item
            name="staffIds"
            label="Colaboradores"
            rules={[{ required: true, message: 'Selecione pelo menos um colaborador' }]}
          >
            <Select mode="multiple" placeholder="Selecione colaboradores">
              {staffs.map(staff => (
                <Option key={staff.id} value={staff.id}>{staff.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />}>
              {modalsHook.modalData.editingPeriod ? 'Salvar' : 'Criar Período'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Visualização de Período */}
      <Modal
        closeIcon={false}
        open={modalsHook.modals.view}
        footer={null}
        width={900}
        onCancel={() => modalsHook.closeModal('view')}
      >
        {modalsHook.modalData.viewingPeriod && (
          <PeriodDetails
            period={modalsHook.modalData.viewingPeriod}
            periodStaffs={periodStaffs}
            tasksPeriod={tasksPeriod}
            projects={projects}
          />
        )}
      </Modal>

      {/* Modal de Organização de Período */}
      <Modal
        open={modalsHook.modals.organization}
        onCancel={() => modalsHook.closeModal('organization')}
        width={1000}
        footer={null}
        closeIcon={false}
      >
        {modalsHook.modalData.organizingPeriod && (
          <PeriodOrganization
            organizingPeriod={modalsHook.modalData.organizingPeriod}
            projects={projects}
            organizationHook={organizationHook}
            updateTotalHours={updateTotalHours}
            addTask={addTask}
            removeTask={removeTask}
            getTaskColor={getTaskColor}
            onBack={() => modalsHook.closeModal('organization')}
          />
        )}
      </Modal>

      {/* Modal de Lições Aprendidas e Desafios */}
      <Modal
        title="Lições Aprendidas e Principais Desafios"
        open={lessonsModal}
        onCancel={() => {
          setLessonsModal(false);
          setSelectedStaffId(undefined);
          lessonsForm.resetFields();
        }}
        width={800}
        footer={null}
      >
        {selectedPeriodForLessons && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>Período: </Text>
              <Text>{selectedPeriodForLessons.name}</Text>
            </div>

            <Form.Item label="Selecione o Colaborador" required>
              <Select
                placeholder="Escolha um colaborador"
                style={{ width: '100%' }}
                value={selectedStaffId}
                onChange={(value) => {
                  setSelectedStaffId(value);
                  // Reset form and reload initial values when staff changes
                  const userTasks = tasksPeriod.filter(tp => tp.periodStaffId === value);
                  const initialValues = userTasks.reduce((acc, task) => {
                    const taskKey = `task_${task.id}`;
                    acc[`${taskKey}_lesson`] = (task as any).lessonLearned || (task as any).LessonLearned || '';
                    acc[`${taskKey}_challenge`] = (task as any).mainChallenge || (task as any).MainChallenge || '';
                    return acc;
                  }, {} as any);
                  lessonsForm.setFieldsValue(initialValues);
                }}
                size="large"
              >
                {periodStaffs
                  .filter(ps => ps.periodId === selectedPeriodForLessons.id)
                  .map(ps => {
                    const staff = staffs.find(s => s.id === ps.staffId);
                    return staff ? (
                      <Option key={ps.id} value={ps.id}>
                        {staff.name}
                      </Option>
                    ) : null;
                  })}
              </Select>
            </Form.Item>

            {selectedStaffId && (() => {
              const userTasks = tasksPeriod.filter(tp => tp.periodStaffId === selectedStaffId);

              // Filter staff from Dev teams
              const devStaffs = staffs.filter(staff => {
                if (!staff.teamId) return false;
                const team = teams.find(t => t.id === staff.teamId);
                return team && team.name.toLowerCase().includes('dev');
              });

              if (userTasks.length === 0) {
                return (
                  <Card>
                    <Text type="secondary">Nenhuma tarefa encontrada para este colaborador neste período.</Text>
                  </Card>
                );
              }

              const handleSaveTask = async (task: TasksPeriod, taskKey: string) => {
                try {
                  setSavingLessons(true);

                  const values = lessonsForm.getFieldsValue();
                  const payload = {
                    Id: task.id,
                    PeriodStaffId: task.periodStaffId,
                    TaskNumber: task.taskNumber,
                    TaskHours: task.taskHours,
                    ProjectId: task.projectId || null,
                    LessonLearned: values[`${taskKey}_lesson`] || '',
                    MainChallenge: values[`${taskKey}_challenge`] || '',
                    CodeReview: values[`${taskKey}_codeReview`] || '',
                    TaskRealHours: values[`${taskKey}_actualHours`] ? Number(values[`${taskKey}_actualHours`]) : 0,
                    AproverId: values[`${taskKey}_approver`] || null,
                    CodeReviewStatus: values[`${taskKey}_status`] !== undefined ? Number(values[`${taskKey}_status`]) : 0
                  };

                  await fetch('/api/tasksPeriod', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });

                  message.success(`Tarefa #${task.taskNumber} salva com sucesso!`);
                  await fetchTasksPeriod();
                } catch (error) {
                  message.error('Erro ao salvar tarefa');
                } finally {
                  setSavingLessons(false);
                }
              };

              return (
                <Form
                  form={lessonsForm}
                  layout="vertical"
                  initialValues={userTasks.reduce((acc, task) => {
                    const taskKey = `task_${task.id}`;
                    acc[`${taskKey}_lesson`] = (task as any).lessonLearned || (task as any).LessonLearned || '';
                    acc[`${taskKey}_challenge`] = (task as any).mainChallenge || (task as any).MainChallenge || '';
                    acc[`${taskKey}_approver`] = (task as any).aproverId || (task as any).AproverId || undefined;
                    acc[`${taskKey}_actualHours`] = (task as any).taskRealHours || (task as any).TaskRealHours || undefined;
                    acc[`${taskKey}_codeReview`] = (task as any).codeReview || (task as any).CodeReview || '';
                    const statusValue = (task as any).codeReviewStatus ?? (task as any).CodeReviewStatus;
                    acc[`${taskKey}_status`] = statusValue !== undefined ? statusValue : 0;
                    return acc;
                  }, {} as any)}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Collapse
                      accordion
                      items={userTasks.map((task) => {
                        const taskKey = `task_${task.id}`;
                        const project = projects.find(p => p.id === task.projectId);

                        return {
                          key: task.id,
                          label: (
                            <Space>
                              <Text strong>Tarefa #{task.taskNumber}</Text>
                              {project && <Text type="secondary">({project.name})</Text>}
                              <Text type="secondary">- {task.taskHours}h planejadas</Text>
                            </Space>
                          ),
                          children: (
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item
                                    name={`${taskKey}_approver`}
                                    label="Aprovador"
                                  >
                                    <Select
                                      placeholder="Selecione um aprovador (Dev)"
                                      allowClear
                                      showSearch
                                      optionFilterProp="children"
                                    >
                                      {devStaffs.map(staff => (
                                        <Option key={staff.id} value={staff.id}>
                                          {staff.name}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    name={`${taskKey}_actualHours`}
                                    label="Horas Gastas"
                                  >
                                    <Input
                                      type="number"
                                      min={0}
                                      step={0.5}
                                      placeholder="Ex: 8"
                                      suffix="h"
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Form.Item
                                name={`${taskKey}_lesson`}
                                label="Lições Aprendidas"
                              >
                                <Input.TextArea
                                  placeholder="O que você aprendeu trabalhando nesta tarefa?"
                                  rows={3}
                                />
                              </Form.Item>

                              <Form.Item
                                name={`${taskKey}_challenge`}
                                label="Principais Desafios"
                              >
                                <Input.TextArea
                                  placeholder="Quais foram os principais desafios enfrentados?"
                                  rows={3}
                                />
                              </Form.Item>

                              <Form.Item
                                name={`${taskKey}_codeReview`}
                                label="Code Review"
                              >
                                <Input.TextArea
                                  placeholder="Notas do code review, sugestões de melhoria, etc."
                                  rows={3}
                                />
                              </Form.Item>

                              <Form.Item
                                name={`${taskKey}_status`}
                                label="Status"
                                style={{ marginBottom: 16 }}
                              >
                                <Select placeholder="Selecione o status">
                                  <Option value={0}>Aberto</Option>
                                  <Option value={1}>Aprovado</Option>
                                  <Option value={2}>Em revisão</Option>
                                  <Option value={3}>Rejeitado</Option>
                                </Select>
                              </Form.Item>

                              <div style={{ textAlign: 'right' }}>
                                <Button
                                  type="primary"
                                  onClick={() => handleSaveTask(task, taskKey)}
                                  loading={savingLessons}
                                >
                                  Salvar Tarefa #{task.taskNumber}
                                </Button>
                              </div>
                            </Space>
                          )
                        };
                      })}
                    />
                  </Space>
                </Form>
              );
            })()}
          </Space>
        )}
      </Modal>

      {/* Modal de Status de Revisão de Código */}
      <Modal
        title="Status de Revisão de Código por Colaborador"
        open={reviewStatusModal}
        onCancel={() => {
          setReviewStatusModal(false);
          setSelectedPeriodForReview(null);
        }}
        width={900}
        footer={null}
      >
        {selectedPeriodForReview && (() => {
          // Get all staff for this period
          const periodStaffList = periodStaffs.filter(ps => ps.periodId === selectedPeriodForReview.id);

          // Calculate review status for each staff
          const staffReviewData = periodStaffList.map(ps => {
            const staff = staffs.find(s => s.id === ps.staffId);
            const staffTasks = tasksPeriod.filter(tp => tp.periodStaffId === ps.id);

            const statusCounts = {
              open: staffTasks.filter(t => (t.codeReviewStatus ?? 0) === 0).length,
              approved: staffTasks.filter(t => (t.codeReviewStatus ?? 0) === 1).length,
              reviewing: staffTasks.filter(t => (t.codeReviewStatus ?? 0) === 2).length,
              rejected: staffTasks.filter(t => (t.codeReviewStatus ?? 0) === 3).length,
              total: staffTasks.length
            };

            const allApproved = statusCounts.total > 0 && statusCounts.approved === statusCounts.total;
            const hasRejected = statusCounts.rejected > 0;

            return {
              staff,
              periodStaffId: ps.id,
              statusCounts,
              allApproved,
              hasRejected,
              tasks: staffTasks
            };
          }).filter(data => data.staff); // Remove entries without staff

          const getStatusColor = (status: number) => {
            switch (status) {
              case 0: return 'default'; // Open
              case 1: return 'success'; // Approved
              case 2: return 'processing'; // Reviewing
              case 3: return 'error'; // Rejected
              default: return 'default';
            }
          };

          const getStatusText = (status: number) => {
            switch (status) {
              case 0: return 'Aberto';
              case 1: return 'Aprovado';
              case 2: return 'Em revisão';
              case 3: return 'Rejeitado';
              default: return 'Desconhecido';
            }
          };

          return (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Período: </Text>
                <Text>{selectedPeriodForReview.name}</Text>
              </div>

              <Collapse
                items={staffReviewData.map(data => ({
                  key: data.periodStaffId,
                  label: (
                    <Space>
                      <Text strong>{data.staff?.name}</Text>
                      <Text type="secondary">
                        ({data.statusCounts.total} {data.statusCounts.total === 1 ? 'tarefa' : 'tarefas'})
                      </Text>
                      {data.allApproved && (
                        <Text type="success" style={{ marginLeft: 8 }}>
                          ✓ Todas aprovadas
                        </Text>
                      )}
                      {data.hasRejected && (
                        <Text type="danger" style={{ marginLeft: 8 }}>
                          ⚠ Contém rejeitadas
                        </Text>
                      )}
                    </Space>
                  ),
                  extra: (
                    <Space size="small">
                      {data.statusCounts.open > 0 && (
                        <Tooltip title="Abertas">
                          <span style={{ padding: '2px 8px', background: '#f0f0f0', borderRadius: 4, fontSize: 12 }}>
                            {data.statusCounts.open}
                          </span>
                        </Tooltip>
                      )}
                      {data.statusCounts.approved > 0 && (
                        <Tooltip title="Aprovadas">
                          <span style={{ padding: '2px 8px', background: '#f6ffed', color: '#52c41a', borderRadius: 4, fontSize: 12 }}>
                            {data.statusCounts.approved}
                          </span>
                        </Tooltip>
                      )}
                      {data.statusCounts.reviewing > 0 && (
                        <Tooltip title="Em revisão">
                          <span style={{ padding: '2px 8px', background: '#e6f7ff', color: '#1890ff', borderRadius: 4, fontSize: 12 }}>
                            {data.statusCounts.reviewing}
                          </span>
                        </Tooltip>
                      )}
                      {data.statusCounts.rejected > 0 && (
                        <Tooltip title="Rejeitadas">
                          <span style={{ padding: '2px 8px', background: '#fff2e8', color: '#fa541c', borderRadius: 4, fontSize: 12 }}>
                            {data.statusCounts.rejected}
                          </span>
                        </Tooltip>
                      )}
                    </Space>
                  ),
                  children: (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      {data.tasks.length === 0 ? (
                        <Text type="secondary">Nenhuma tarefa encontrada.</Text>
                      ) : (
                        <Table
                          size="small"
                          dataSource={data.tasks}
                          rowKey="id"
                          pagination={false}
                          columns={[
                            {
                              title: 'Tarefa',
                              dataIndex: 'taskNumber',
                              key: 'taskNumber',
                              render: (num: number) => <Text strong>#{num}</Text>
                            },
                            {
                              title: 'Projeto',
                              dataIndex: 'projectId',
                              key: 'projectId',
                              render: (projectId: string) => {
                                const project = projects.find(p => p.id === projectId);
                                return project ? project.name : '-';
                              }
                            },
                            {
                              title: 'Horas Planejadas',
                              dataIndex: 'taskHours',
                              key: 'taskHours',
                              render: (hours: number) => `${hours}h`
                            },
                            {
                              title: 'Horas Reais',
                              dataIndex: 'taskRealHours',
                              key: 'taskRealHours',
                              render: (hours: number) => hours ? `${hours}h` : '-'
                            },
                            {
                              title: 'Aprovador',
                              dataIndex: 'aproverId',
                              key: 'aproverId',
                              render: (aproverId: string) => {
                                if (!aproverId) return '-';
                                const approver = staffs.find(s => s.id === aproverId);
                                return approver ? approver.name : '-';
                              }
                            },
                            {
                              title: 'Status',
                              dataIndex: 'codeReviewStatus',
                              key: 'codeReviewStatus',
                              render: (status: number) => (
                                <span
                                  style={{
                                    padding: '4px 12px',
                                    borderRadius: 4,
                                    fontSize: 12,
                                    background:
                                      status === 0 ? '#f0f0f0' :
                                        status === 1 ? '#f6ffed' :
                                          status === 2 ? '#e6f7ff' :
                                            '#fff2e8',
                                    color:
                                      status === 0 ? '#595959' :
                                        status === 1 ? '#52c41a' :
                                          status === 2 ? '#1890ff' :
                                            '#fa541c'
                                  }}
                                >
                                  {getStatusText(status ?? 0)}
                                </span>
                              )
                            }
                          ]}
                        />
                      )}
                    </Space>
                  )
                }))}
              />
            </Space>
          );
        })()}
      </Modal>
    </div>
  );
}

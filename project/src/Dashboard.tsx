import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Bot, Phone, Calendar, ArrowUpDown, Database, PlayCircle, BarChart as FlowChart, Users, PhoneCall, Link2, Building2, Settings, ChevronLeft, ChevronRight, Mic, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

interface Agent {
  id: string;
  name: string;
  voice_settings: {
    engine: string;
    languages: string[];
  };
  phone_number?: string;
  type?: 'inbound' | 'outbound';
  updated_at: string;
}

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  agentName: string;
}

function DeleteConfirmation({ isOpen, onClose, onConfirm, agentName }: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-[#141616] mb-4">Supprimer l'assistant</h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer "{agentName}" ? Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#e9ecef] hover:bg-[#f7f9fb]"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'updated_at'>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('assistants');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAgents();
  }, [sortField, sortDirection]);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: 'name' | 'updated_at') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateAgent = () => {
    navigate('/agent-wizard');
  };

  const handleEditAgent = (agentId: string) => {
    navigate(`/agent-wizard?id=${agentId}`);
  };

  const handleDeleteClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAgent) return;

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', selectedAgent.id);

      if (error) throw error;

      // Refresh the agents list
      fetchAgents();
      setShowDeleteConfirmation(false);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Une erreur est survenue lors de la suppression de l\'assistant');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Une erreur est survenue lors de la déconnexion');
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sidebarItems = [
    { icon: Bot, label: 'Assistants', id: 'assistants' },
    { icon: Database, label: 'Knowledge Base', id: 'knowledge' },
    { icon: PlayCircle, label: 'Actions', id: 'actions' },
    { icon: FlowChart, label: 'Workflows', id: 'workflows' },
    { icon: Users, label: 'Contacts', id: 'contacts' },
    { icon: PhoneCall, label: 'Phone Numbers', id: 'phone-numbers' },
    { icon: Link2, label: 'Integrations', id: 'integrations' },
  ];

  const bottomSidebarItems = [
    { icon: Building2, label: 'Agency', id: 'agency' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-[#fefffe] flex">
      {/* Sidebar */}
      <div 
        className={`bg-[#f7f9fb] border-r border-[#e9ecef] flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="text-[#435175]" size={32} />
            {!isSidebarCollapsed && <span className="text-xl font-semibold text-[#141616]">AlloKoli</span>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="text-[#141616] hover:bg-[#e9ecef] p-2 rounded-lg"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Main menu items */}
        <div className="flex-1 px-4 py-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-[#435175] text-white'
                  : 'text-[#141616] hover:bg-[#e9ecef]'
              }`}
            >
              <item.icon size={20} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Bottom menu items */}
        <div className="px-4 py-6 border-t border-[#e9ecef]">
          {bottomSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-[#435175] text-white'
                  : 'text-[#141616] hover:bg-[#e9ecef]'
              }`}
            >
              <item.icon size={20} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-[#e9ecef] p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Tabs */}
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'assistants'
                    ? 'bg-[#f7f9fb] text-[#435175]'
                    : 'text-[#141616] hover:bg-[#f7f9fb]'
                }`}
              >
                Assistants
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'teams'
                    ? 'bg-[#f7f9fb] text-[#435175]'
                    : 'text-[#141616] hover:bg-[#f7f9fb]'
                }`}
              >
                Teams
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-[#e9ecef] focus:outline-none focus:ring-2 focus:ring-[#435175] w-64"
                />
              </div>

              {/* Create Assistant Button */}
              <button
                onClick={handleCreateAgent}
                className="bg-[#435175] hover:bg-[#5b6a91] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Créer un assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg border border-[#e9ecef] overflow-hidden">
            <table className="min-w-full divide-y divide-[#e9ecef]">
              <thead className="bg-[#f7f9fb]">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-sm font-medium text-[#141616] cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Nom de l'assistant</span>
                      <ArrowUpDown size={16} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#141616]">
                    <div className="flex items-center space-x-2">
                      <Mic size={16} />
                      <span>Moteur vocal</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#141616]">
                    <div className="flex items-center space-x-2">
                      <Phone size={16} />
                      <span>Numéro de téléphone</span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-medium text-[#141616] cursor-pointer"
                    onClick={() => handleSort('updated_at')}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Dernière mise à jour</span>
                      <ArrowUpDown size={16} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#141616]">Type</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-[#141616]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9ecef]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#435175]"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-[#f7f9fb]">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Bot size={20} className="text-[#435175]" />
                          <span className="font-medium text-[#141616]">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{agent.voice_settings?.engine || 'Default'}</td>
                      <td className="px-6 py-4">{agent.phone_number || '-'}</td>
                      <td className="px-6 py-4">
                        {new Date(agent.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          agent.type === 'inbound'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {agent.type || 'Entrant'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditAgent(agent.id)}
                            className="text-gray-600 hover:text-[#435175] p-2 rounded-lg hover:bg-gray-100"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(agent)}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-[#435175] p-2 rounded-lg hover:bg-gray-100">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-[#e9ecef] disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[#141616]">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-[#e9ecef] disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setSelectedAgent(null);
        }}
        onConfirm={handleDeleteConfirm}
        agentName={selectedAgent?.name || ''}
      />
    </div>
  );
}

export default Dashboard;
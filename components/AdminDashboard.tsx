
import React, { useState } from 'react';
import { User, Group, UserRole } from '../types';
import { PencilIcon, TrashIcon, XCircleIcon, UserPlusIcon, PlusIcon } from './icons';

interface AdminDashboardProps {
  users: User[];
  groups: Group[];
  onUpdateUser: (user: User) => void;
  onUpdateGroup: (group: Group) => void;
  onCreateGroup: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  groups,
  onUpdateUser,
  onUpdateGroup,
  onCreateGroup,
  onDeleteGroup,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // --- USER MANAGEMENT ---

  const handleUserEditClick = (user: User) => {
    setEditingUser({ ...user }); // Clone to avoid direct mutation
  };

  const handleUserSave = () => {
    if (editingUser) {
      onUpdateUser(editingUser);
      setEditingUser(null);
    }
  };

  const handleGroupToggleForUser = (groupId: string) => {
    if (!editingUser) return;
    const currentGroups = new Set(editingUser.groups);
    if (currentGroups.has(groupId)) {
      currentGroups.delete(groupId);
    } else {
      currentGroups.add(groupId);
    }
    setEditingUser({ ...editingUser, groups: Array.from(currentGroups) });
  };

  // --- GROUP MANAGEMENT ---

  const handleGroupSave = () => {
    if (editingGroup) {
      if (isCreatingGroup) {
         onCreateGroup(editingGroup);
      } else {
         onUpdateGroup(editingGroup);
      }
      setEditingGroup(null);
      setIsCreatingGroup(false);
    }
  };

  const startCreateGroup = () => {
      setEditingGroup({
          id: `group-${Date.now()}`,
          name: '',
          description: '',
          adminIds: [] // Default no admins, needs assignment
      });
      setIsCreatingGroup(true);
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="bg-primary text-white px-2 py-1 rounded mr-3 text-sm">ADMIN</span>
            Tableau de bord
          </h1>
          <button onClick={onClose} className="text-gray-300 hover:text-white font-semibold">
             Fermer & Retourner à l'app
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* TABS */}
        <div className="flex space-x-4 mb-6 border-b border-gray-300">
          <button
            className={`pb-3 px-4 font-semibold ${activeTab === 'users' ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            Gestion des Utilisateurs
          </button>
          <button
            className={`pb-3 px-4 font-semibold ${activeTab === 'groups' ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('groups')}
          >
            Gestion des Groupes
          </button>
        </div>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groupes</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-full mr-3" src={user.avatarUrl} alt="" />
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === UserRole.GLOBAL_ADMIN ? 'bg-purple-100 text-purple-800' : user.role === UserRole.GROUP_ADMIN ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.groups.length} groupes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleUserEditClick(user)} className="text-primary hover:text-primary-hover">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GROUPS TAB */}
        {activeTab === 'groups' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={startCreateGroup}
                    className="flex items-center bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded shadow"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> Créer un groupe
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(group => (
                <div key={group.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                    <div className="flex space-x-2">
                        <button onClick={() => { setEditingGroup({...group}); setIsCreatingGroup(false); }} className="text-gray-400 hover:text-primary"><PencilIcon className="h-5 w-5" /></button>
                        <button onClick={() => { if(confirm('Supprimer ce groupe ?')) onDeleteGroup(group.id); }} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{group.description}</p>
                  <p className="text-xs text-gray-400 mt-4">{group.adminIds.length} administrateurs</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Modifier {editingUser.name}</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              >
                <option value={UserRole.PARENT}>Parent</option>
                <option value={UserRole.GROUP_ADMIN}>Admin de Groupe</option>
                <option value={UserRole.GLOBAL_ADMIN}>Admin Global</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Membre des groupes :</label>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-gray-50">
                {groups.map(group => (
                  <label key={group.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.groups.includes(group.id)}
                      onChange={() => handleGroupToggleForUser(group.id)}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-sm text-gray-800">{group.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Annuler</button>
              <button onClick={handleUserSave} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT GROUP */}
      {editingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">{isCreatingGroup ? 'Créer un groupe' : 'Modifier le groupe'}</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nom du groupe</label>
              <input
                type="text"
                value={editingGroup.name}
                onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editingGroup.description}
                onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setEditingGroup(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Annuler</button>
              <button onClick={handleGroupSave} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

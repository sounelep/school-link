
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MOCK_USERS, MOCK_GROUPS, MOCK_MESSAGES, MOCK_INSCRIPTION_TABLES, LOGGED_IN_USER_ID } from './lib/mockData';
import { User, Group, Message, InscriptionTable, MessageType, Reply, UserRole } from './types';
import { UsersIcon, MegaphoneIcon, WrenchScrewdriverIcon, BookOpenIcon, BellIcon, Cog6ToothIcon, CheckCircleIcon, XCircleIcon, PaperClipIcon, LockClosedIcon, SunIcon, PlusIcon, ClockIcon, DocumentIcon, ArrowLeftOnRectangleIcon, ComputerDesktopIcon, ChevronDownIcon, ChevronUpIcon } from './components/icons';
import { InscriptionTable as InscriptionTableComponent } from './components/InscriptionTable';
import { AdminExportModal } from './components/AdminExportModal';
import { NewMessageForm } from './components/NewMessageForm';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';

const GROUP_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
  'group-bureau': UsersIcon,
  'group-animation': MegaphoneIcon,
  'group-travaux': WrenchScrewdriverIcon,
  'group-ce1': BookOpenIcon,
  'group-cm2': BookOpenIcon,
  'group-jardinage': SunIcon,
};

const Header: React.FC<{ user: User; onLogout: () => void; onOpenAdmin: () => void }> = ({ user, onLogout, onOpenAdmin }) => (
  <header className="bg-surface shadow-md p-4 flex justify-between items-center z-10">
    <h1 className="text-2xl font-bold text-primary">School Link</h1>
    <div className="flex items-center space-x-4">
      {user.role === UserRole.GLOBAL_ADMIN && (
        <button onClick={onOpenAdmin} className="text-text-secondary hover:text-primary flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded" title="Administration">
            <ComputerDesktopIcon className="h-6 w-6" />
            <span className="text-xs font-bold hidden sm:block">Admin</span>
        </button>
      )}
      <button className="text-text-secondary hover:text-primary relative">
        <BellIcon className="h-6 w-6" />
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
      </button>
      
      <div className="flex items-center space-x-2">
        <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
        <span className="hidden sm:block font-semibold text-text-primary">{user.name}</span>
      </div>
      
      <button onClick={onLogout} className="text-text-secondary hover:text-red-500 ml-2" title="Se déconnecter">
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
      </button>
    </div>
  </header>
);

const Sidebar: React.FC<{
  userGroups: Group[];
  selectedGroupIds: string[];
  onToggleGroup: (groupId: string) => void;
  onNewMessage: () => void;
}> = ({ userGroups, selectedGroupIds, onToggleGroup, onNewMessage }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getIcon = (groupId: string) => {
        // Default icon if not mapped
        const IconComponent = GROUP_ICONS[groupId] || UsersIcon; 
        return <IconComponent className="h-6 w-6 mr-3" />;
    };

    const handleGroupClick = (groupId: string) => {
        onToggleGroup(groupId);
        // Note: On ne ferme plus le menu automatiquement pour permettre la sélection multiple
    };

    return (
        <aside className="w-full md:w-72 bg-surface p-4 space-y-2 border-r border-gray-200 flex-shrink-0 flex flex-col">
            <div className="flex justify-between items-center px-2 mb-4">
                <h2 className="text-lg font-bold text-text-primary">Mes Groupes</h2>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={onNewMessage}
                        title="Créer un nouveau message"
                        className="bg-primary hover:bg-primary-hover text-white p-2 rounded-full shadow-md transition duration-300"
                    >
                        <PlusIcon className="h-5 w-5" />
                    </button>
                    
                    {/* Toggle Button for Mobile */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-500 hover:text-primary p-1"
                    >
                        {isMobileMenuOpen ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
                    </button>
                </div>
            </div>
            
            <p className="text-xs text-gray-500 px-2 mb-2 md:block hidden">Sélectionnez plusieurs groupes pour filtrer.</p>

            {/* Group List - Hidden on mobile unless toggled open, always visible on desktop */}
            <ul className={`flex-grow overflow-y-auto ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                {userGroups.map(group => {
                    const isSelected = selectedGroupIds.includes(group.id);
                    return (
                        <li key={group.id}>
                            <button
                                onClick={() => handleGroupClick(group.id)}
                                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors duration-200 mb-1 ${isSelected ? 'bg-primary text-white' : 'hover:bg-gray-200 text-text-primary'}`}
                            >
                                {getIcon(group.id)}
                                <div className="flex-grow">
                                    <span className="font-semibold">{group.name}</span>
                                </div>
                                {isSelected && <CheckCircleIcon className="h-5 w-5 ml-2" />}
                            </button>
                        </li>
                    );
                })}
                {userGroups.length === 0 && (
                    <li className="text-gray-500 text-sm text-center italic mt-4">
                        Vous n'êtes inscrit dans aucun groupe.
                    </li>
                )}
            </ul>
        </aside>
    );
};

const ReplyForm: React.FC<{
    messageId: string;
    onSubmit: (messageId: string, content: string, isPrivate: boolean) => void;
}> = ({ messageId, onSubmit }) => {
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(messageId, content, isPrivate);
            setContent('');
            setIsPrivate(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrire une réponse..."
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                rows={2}
            ></textarea>
            <div className="flex justify-between items-center mt-2">
                <label className="flex items-center space-x-2 text-sm text-text-secondary cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="rounded text-primary focus:ring-primary"
                    />
                    <LockClosedIcon className="h-4 w-4" />
                    <span>Réponse privée (admins seulement)</span>
                </label>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
                    Envoyer
                </button>
            </div>
        </form>
    );
};

const MessageCard: React.FC<{
    message: Message;
    currentUser: User;
    usersMap: Map<string, User>;
    groupName?: string;
    isGroupAdmin: boolean;
    inscriptionTable?: InscriptionTable;
    onReply: (messageId: string, content: string, isPrivate: boolean) => void;
    onPollResponse: (messageId: string, attending: boolean) => void;
    onRegister: (tableId: string, newSlots: { activityId: string, timeSlotId: string }[]) => void;
    onExport: (exportType: 'poll' | 'inscription', messageId: string, tableId?: string) => void;
}> = ({ message, currentUser, usersMap, groupName, isGroupAdmin, inscriptionTable, onReply, onPollResponse, onRegister, onExport }) => {
    const author = usersMap.get(message.authorId);

    const visibleReplies = message.replies.filter(reply => 
        !reply.isPrivate || isGroupAdmin || reply.authorId === currentUser.id
    );

    const isScheduled = message.scheduledAt && new Date(message.scheduledAt) > new Date();

    return (
        <div className={`bg-surface rounded-lg shadow-md p-4 sm:p-6 mb-6 border ${isScheduled ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
            {isScheduled && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center mb-4">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Programmé pour le {message.scheduledAt?.toLocaleDateString()} à {message.scheduledAt?.toLocaleTimeString()}
                </div>
            )}
            
            <div className="flex items-start space-x-4">
                <img src={author?.avatarUrl} alt={author?.name} className="h-12 w-12 rounded-full" />
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-text-primary">{author?.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-text-secondary">
                                <span>{message.timestamp.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                {groupName && (
                                    <>
                                        <span>•</span>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                                            {groupName}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        {message.type === MessageType.SIMPLE_POLL && isGroupAdmin && (
                            <button onClick={() => onExport('poll', message.id)} className="text-sm bg-secondary hover:bg-secondary-hover text-white font-bold py-1 px-3 rounded-md">Exporter</button>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-primary mt-3">{message.title}</h2>
                    <p className="mt-2 text-text-primary whitespace-pre-wrap">{message.content}</p>
                    
                    {message.imageUrl && <img src={message.imageUrl} alt="illustration" className="mt-4 rounded-lg max-h-80 w-full object-cover" />}
                    {message.linkUrl && <a href={message.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center space-x-2 text-primary hover:underline"><PaperClipIcon className="h-5 w-5"/><span>{message.linkUrl}</span></a>}
                    
                    {message.attachmentUrl && (
                         <div className="mt-4">
                            <a 
                                href={message.attachmentUrl} 
                                download 
                                className="inline-flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-4 py-3 rounded-lg transition-colors text-primary font-medium"
                            >
                                <DocumentIcon className="h-6 w-6" />
                                <span>{message.attachmentName || 'Document joint'}</span>
                            </a>
                        </div>
                    )}

                    {message.autoReminders && message.eventDate && (
                         <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <BellIcon className="h-3 w-3 mr-1" />
                            Rappels automatiques activés (J-7, J-3 avant le {message.eventDate.toLocaleDateString()})
                         </div>
                    )}

                    {message.type === MessageType.SIMPLE_POLL && (
                        <div className="mt-4">
                            <div className="flex space-x-4">
                                <button onClick={() => onPollResponse(message.id, true)} className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition"><CheckCircleIcon className="h-6 w-6"/><span>Je serai présent</span></button>
                                <button onClick={() => onPollResponse(message.id, false)} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition"><XCircleIcon className="h-6 w-6"/><span>Je ne serai pas disponible</span></button>
                            </div>
                            <div className="mt-4 text-sm">
                                <p><strong>Présents ({message.attendees?.length || 0}):</strong> {(message.attendees || []).map(id => usersMap.get(id)?.name).join(', ')}</p>
                            </div>
                        </div>
                    )}

                    {message.type === MessageType.INSCRIPTION_FORM && inscriptionTable && (
                        <InscriptionTableComponent 
                            table={inscriptionTable}
                            currentUser={currentUser}
                            users={Array.from(usersMap.values())}
                            onRegister={(newSlots) => onRegister(inscriptionTable.id, newSlots)}
                            isGroupAdmin={isGroupAdmin}
                            onExport={() => onExport('inscription', message.id, inscriptionTable.id)}
                        />
                    )}

                    <div className="mt-6 border-t pt-4">
                        <h4 className="font-semibold text-text-secondary mb-2">Réponses ({visibleReplies.length})</h4>
                        {visibleReplies.map(reply => {
                            const replyAuthor = usersMap.get(reply.authorId);
                            return (
                                <div key={reply.id} className="flex items-start space-x-3 mt-3">
                                    <img src={replyAuthor?.avatarUrl} alt={replyAuthor?.name} className="h-8 w-8 rounded-full"/>
                                    <div className="bg-gray-100 rounded-lg p-3 flex-grow">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-sm text-text-primary">{replyAuthor?.name}</p>
                                            {reply.isPrivate && <span title="Message privé" className="text-text-secondary"><LockClosedIcon className="h-4 w-4"/></span>}
                                        </div>
                                        <p className="text-sm text-text-primary">{reply.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <ReplyForm messageId={message.id} onSubmit={onReply} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    // --- STATE MANAGEMENT WITH LOCAL STORAGE PERSISTENCE ---
    
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('sl_users');
        return saved ? JSON.parse(saved) : MOCK_USERS;
    });
    const [groups, setGroups] = useState<Group[]>(() => {
        const saved = localStorage.getItem('sl_groups');
        return saved ? JSON.parse(saved) : MOCK_GROUPS;
    });
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem('sl_messages');
        // Need to deserialize dates properly
        if (saved) {
            const parsed: Message[] = JSON.parse(saved);
            return parsed.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
                scheduledAt: msg.scheduledAt ? new Date(msg.scheduledAt) : undefined,
                eventDate: msg.eventDate ? new Date(msg.eventDate) : undefined,
                replies: msg.replies.map(r => ({...r, timestamp: new Date(r.timestamp)}))
            }));
        }
        return MOCK_MESSAGES;
    });
    const [inscriptionTables, setInscriptionTables] = useState<InscriptionTable[]>(MOCK_INSCRIPTION_TABLES);

    // Persist changes
    useEffect(() => localStorage.setItem('sl_users', JSON.stringify(users)), [users]);
    useEffect(() => localStorage.setItem('sl_groups', JSON.stringify(groups)), [groups]);
    useEffect(() => localStorage.setItem('sl_messages', JSON.stringify(messages)), [messages]);

    // --- AUTHENTICATION STATE ---
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    
    // --- UI STATE ---
    const [exportModal, setExportModal] = useState({ isOpen: false, title: '', data: '' });
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
    
    // Changed to support multiple selection
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

    // --- DERIVED DATA ---
    const currentUser = useMemo(() => users.find(u => u.id === loggedInUserId), [users, loggedInUserId]);
    const usersMap = useMemo(() => new Map(users.map(user => [user.id, user])), [users]);
    const tablesMap = useMemo(() => new Map(inscriptionTables.map(table => [table.id, table])), [inscriptionTables]);
    const userGroups = useMemo(() => {
        if (!currentUser) return [];
        return groups.filter(g => currentUser.groups.includes(g.id));
    }, [groups, currentUser]);

    // Set initial active group when user logs in (only if selection is empty)
    useEffect(() => {
        if (currentUser && selectedGroupIds.length === 0) {
            const validGroups = groups.filter(g => currentUser.groups.includes(g.id));
            if (validGroups.length > 0) {
                setSelectedGroupIds([validGroups[0].id]);
            }
        }
    }, [currentUser, groups, selectedGroupIds.length]);

    // --- HANDLERS ---

    const handleLogin = (userId: string) => {
        setLoggedInUserId(userId);
    };

    const handleLogout = () => {
        setLoggedInUserId(null);
        setIsAdminDashboardOpen(false);
        setSelectedGroupIds([]);
    };

    const toggleGroupSelection = (groupId: string) => {
        setSelectedGroupIds(prev => {
            if (prev.includes(groupId)) {
                return prev.filter(id => id !== groupId);
            } else {
                return [...prev, groupId];
            }
        });
    };

    // Admin Actions
    const handleUpdateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleCreateGroup = (newGroup: Group) => {
        setGroups(prev => [...prev, newGroup]);
    };

    const handleUpdateGroup = (updatedGroup: Group) => {
        setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    };

    const handleDeleteGroup = (groupId: string) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
        // Remove this group from users
        setUsers(prev => prev.map(u => ({
            ...u,
            groups: u.groups.filter(gid => gid !== groupId)
        })));
        // Remove from selection if present
        setSelectedGroupIds(prev => prev.filter(id => id !== groupId));
    };

    // Message Actions
    const handleReplySubmit = useCallback((messageId: string, content: string, isPrivate: boolean) => {
        if (!currentUser) return;
        setMessages(currentMessages => currentMessages.map(msg => {
            if (msg.id === messageId) {
                const newReply: Reply = {
                    id: `reply-${Date.now()}`,
                    authorId: currentUser.id,
                    content,
                    timestamp: new Date(),
                    isPrivate,
                };
                return { ...msg, replies: [...msg.replies, newReply] };
            }
            return msg;
        }));
    }, [currentUser]);

    const handlePollResponse = useCallback((messageId: string, attending: boolean) => {
        if (!currentUser) return;
        setMessages(currentMessages => currentMessages.map(msg => {
            if (msg.id === messageId) {
                const attendees = new Set(msg.attendees || []);
                const absentees = new Set(msg.absentees || []);
                if (attending) {
                    attendees.add(currentUser.id);
                    absentees.delete(currentUser.id);
                } else {
                    absentees.add(currentUser.id);
                    attendees.delete(currentUser.id);
                }
                return { ...msg, attendees: Array.from(attendees), absentees: Array.from(absentees) };
            }
            return msg;
        }));
    }, [currentUser]);

    const handleInscriptionRegister = useCallback((tableId: string, newSlots: { activityId: string, timeSlotId: string }[]) => {
        if (!currentUser) return;
        setInscriptionTables(currentTables => currentTables.map(table => {
            if (table.id === tableId) {
                const updatedSlots = table.slots.map(slot => {
                    const isRegistering = newSlots.some(s => s.activityId === slot.activityId && s.timeSlotId === slot.timeSlotId);
                    if (isRegistering) {
                        const isAlreadyRegistered = slot.registeredUserIds.includes(currentUser.id);
                        const hasCapacity = slot.registeredUserIds.length < slot.capacity;
                        if (!isAlreadyRegistered && hasCapacity) {
                           return { ...slot, registeredUserIds: [...slot.registeredUserIds, currentUser.id] };
                        }
                    }
                    return slot;
                });
                return { ...table, slots: updatedSlots };
            }
            return table;
        }));
    }, [currentUser]);

    const handleCreateMessage = (data: any) => {
        if (!currentUser) return;
        // Fake file upload
        let attachmentUrl = undefined;
        let attachmentName = undefined;
        if (data.attachment) {
            attachmentUrl = URL.createObjectURL(data.attachment);
            attachmentName = data.attachment.name;
        }

        if (data.sendEmail && data.emailRecipientsCount > 0) {
            alert(`${data.emailRecipientsCount} email(s) simulé(s) envoyé(s) avec succès aux parents du groupe.`);
        }

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            groupId: data.groupId,
            authorId: currentUser.id,
            type: data.type,
            title: data.title,
            content: data.content,
            imageUrl: data.imageUrl,
            linkUrl: data.linkUrl,
            attachmentName: attachmentName,
            attachmentUrl: attachmentUrl,
            timestamp: new Date(),
            replies: [],
            attendees: data.type === MessageType.SIMPLE_POLL ? [] : undefined,
            absentees: data.type === MessageType.SIMPLE_POLL ? [] : undefined,
            scheduledAt: data.scheduledAt,
            eventDate: data.eventDate,
            autoReminders: data.autoReminders,
        };
        
        setMessages(prev => [newMessage, ...prev]);
        // If the user created a message for a group that isn't currently selected, select it.
        if (!selectedGroupIds.includes(data.groupId)) {
            setSelectedGroupIds(prev => [data.groupId, ...prev]);
        }
    };

    const handleExport = useCallback((exportType: 'poll' | 'inscription', messageId: string, tableId?: string) => {
        let title = '';
        let data = '';
        if (exportType === 'poll') {
            const message = messages.find(m => m.id === messageId);
            if (!message) return;
            title = `Export des réponses - "${message.title}"`;
            const attendees = (message.attendees || []).map(id => ` - ${usersMap.get(id)?.name || 'Inconnu'}`).join('\n');
            const absentees = (message.absentees || []).map(id => ` - ${usersMap.get(id)?.name || 'Inconnu'}`).join('\n');
            data = `PRÉSENTS:\n${attendees || ' - Aucun'}\n\nABSENTS:\n${absentees || ' - Aucun'}`;
        } else if (exportType === 'inscription' && tableId) {
            const table = tablesMap.get(tableId);
            if (!table) return;
            title = `Export des inscrits - "${table.title}"`;
            const lines = table.slots
                .filter(slot => slot.registeredUserIds.length > 0)
                .map(slot => {
                    const activity = table.activities.find(a => a.id === slot.activityId);
                    const timeSlot = table.timeSlots.find(t => t.id === slot.timeSlotId);
                    const names = slot.registeredUserIds.map(id => usersMap.get(id)?.name || 'Inconnu').join(', ');
                    return `[${timeSlot?.label} - ${activity?.name}]:\n  ${names}`;
                });
            data = lines.join('\n\n') || "Aucun inscrit pour le moment.";
        }
        setExportModal({ isOpen: true, title, data });
    }, [messages, tablesMap, usersMap]);

    // Helper to check if current user is admin of the *specific group the message belongs to*
    const isUserAdminOfGroup = useCallback((groupId: string) => {
        if (!currentUser) return false;
        if (currentUser.role === UserRole.GLOBAL_ADMIN) return true;
        const group = groups.find(g => g.id === groupId);
        return group ? group.adminIds.includes(currentUser.id) : false;
    }, [currentUser, groups]);

    const displayedMessages = useMemo(() => {
        if (selectedGroupIds.length === 0 || !currentUser) return [];
        
        return messages
            // Filter by SELECTED groups
            .filter(msg => selectedGroupIds.includes(msg.groupId))
            .filter(msg => {
                // Logic for Premium filtering
                if (currentUser.isPremium && currentUser.optOutOfActivities) {
                    if (msg.type === MessageType.INSCRIPTION_FORM || msg.type === MessageType.SIMPLE_POLL) return false;
                }
                // Logic for Scheduled messages
                if (msg.scheduledAt && new Date(msg.scheduledAt) > new Date()) {
                    // Check permissions for THIS message's group
                    return isUserAdminOfGroup(msg.groupId);
                }
                return true;
            })
            .sort((a, b) => {
                 const timeA = a.scheduledAt || a.timestamp;
                 const timeB = b.scheduledAt || b.timestamp;
                 return new Date(timeB).getTime() - new Date(timeA).getTime();
            });
    }, [selectedGroupIds, messages, currentUser, groups, isUserAdminOfGroup]);


    // --- RENDER ---

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (isAdminDashboardOpen && currentUser.role === UserRole.GLOBAL_ADMIN) {
        return (
            <AdminDashboard 
                users={users} 
                groups={groups} 
                onUpdateUser={handleUpdateUser}
                onUpdateGroup={handleUpdateGroup}
                onCreateGroup={handleCreateGroup}
                onDeleteGroup={handleDeleteGroup}
                onClose={() => setIsAdminDashboardOpen(false)}
            />
        );
    }

    return (
        <div className="flex flex-col h-screen font-sans text-text-primary bg-background">
            <Header 
                user={currentUser} 
                onLogout={handleLogout} 
                onOpenAdmin={() => setIsAdminDashboardOpen(true)} 
            />
            <div className="flex flex-grow overflow-hidden flex-col md:flex-row">
                <Sidebar 
                    userGroups={userGroups} 
                    selectedGroupIds={selectedGroupIds} 
                    onToggleGroup={toggleGroupSelection} 
                    onNewMessage={() => setIsNewMessageModalOpen(true)}
                />
                <main className="flex-grow p-2 sm:p-4 lg:p-6 overflow-y-auto">
                    {selectedGroupIds.length > 0 ? (
                        <div>
                            {displayedMessages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">Aucun message visible pour la sélection actuelle.</div>
                            )}
                            {displayedMessages.map(message => (
                                <MessageCard
                                    key={message.id}
                                    message={message}
                                    currentUser={currentUser}
                                    usersMap={usersMap}
                                    groupName={groups.find(g => g.id === message.groupId)?.name}
                                    isGroupAdmin={isUserAdminOfGroup(message.groupId)}
                                    inscriptionTable={message.inscriptionTableId ? tablesMap.get(message.inscriptionTableId) : undefined}
                                    onReply={handleReplySubmit}
                                    onPollResponse={handlePollResponse}
                                    onRegister={handleInscriptionRegister}
                                    onExport={handleExport}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-text-secondary text-lg px-4 text-center">Sélectionnez un ou plusieurs groupes dans le menu pour voir les messages.</p>
                        </div>
                    )}
                </main>
            </div>
            
            <AdminExportModal 
                isOpen={exportModal.isOpen} 
                onClose={() => setExportModal({ isOpen: false, title: '', data: '' })} 
                title={exportModal.title} 
                data={exportModal.data} 
            />
            
            <NewMessageForm 
                isOpen={isNewMessageModalOpen}
                onClose={() => setIsNewMessageModalOpen(false)}
                groups={userGroups}
                users={users}
                // Default to first selected group or first available group
                currentGroupId={selectedGroupIds.length > 0 ? selectedGroupIds[0] : (userGroups[0]?.id || null)}
                onSubmit={handleCreateMessage}
            />
        </div>
    );
}

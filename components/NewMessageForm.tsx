import React, { useState, useMemo } from 'react';
import { Group, MessageType, User } from '../types';
import { XCircleIcon, ClockIcon, CalendarDaysIcon, PaperClipIcon, EnvelopeIcon } from './icons';

interface NewMessageFormProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  users: User[];
  currentGroupId: string | null;
  onSubmit: (data: any) => void;
}

export const NewMessageForm: React.FC<NewMessageFormProps> = ({ isOpen, onClose, groups, users, currentGroupId, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState(currentGroupId || (groups.length > 0 ? groups[0].id : ''));
  const [type, setType] = useState<MessageType>(MessageType.ANNOUNCEMENT);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  // Pièce jointe
  const [attachment, setAttachment] = useState<File | null>(null);

  // Planification & Rappels
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  
  const [eventDate, setEventDate] = useState('');
  const [autoReminders, setAutoReminders] = useState(false);

  // Email
  const [sendEmail, setSendEmail] = useState(false);

  if (!isOpen) return null;

  // Calculer le nombre de destinataires email potentiels dans le groupe sélectionné
  const emailRecipientsCount = useMemo(() => {
    if (!groupId) return 0;
    return users.filter(u => 
      u.groups.includes(groupId) && 
      u.emailNotifications // Seuls ceux qui ont activé les notifs email
    ).length;
  }, [groupId, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageData = {
      title,
      content,
      groupId,
      type,
      imageUrl: imageUrl || undefined,
      linkUrl: linkUrl || undefined,
      attachment: attachment, // Le fichier objet
      sendEmail,
      emailRecipientsCount,
      scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt) : undefined,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      autoReminders: eventDate ? autoReminders : false,
    };

    onSubmit(messageData);
    
    // Reset form
    setTitle('');
    setContent('');
    setAttachment(null);
    setSendEmail(false);
    setIsScheduled(false);
    setScheduledAt('');
    setEventDate('');
    setAutoReminders(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setAttachment(e.target.files[0]);
      }
  };

  // Classes communes pour les inputs en mode sombre
  const inputClasses = "mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm p-2 border focus:ring-primary focus:border-primary placeholder-gray-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Nouveau Message</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="new-message-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Sélection du groupe */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Groupe</label>
              <select 
                value={groupId} 
                onChange={(e) => setGroupId(e.target.value)}
                className={inputClasses}
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Type de message */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Type de message</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as MessageType)}
                className={inputClasses}
              >
                <option value={MessageType.ANNOUNCEMENT}>Annonce standard</option>
                <option value={MessageType.SIMPLE_POLL}>Sondage de présence</option>
              </select>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Titre</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClasses}
                placeholder="Sujet du message"
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Contenu</label>
              <textarea 
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className={inputClasses}
                placeholder="Votre message..."
              />
            </div>
            
            {/* Médias & Fichiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">URL Image (optionnel)</label>
                    <input 
                        type="url" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className={inputClasses}
                        placeholder="https://..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">URL Lien (optionnel)</label>
                    <input 
                        type="url" 
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className={inputClasses}
                        placeholder="https://..."
                    />
                </div>
            </div>

            {/* Pièce jointe */}
             <div>
                <label className="block text-sm font-medium text-gray-300">Joindre un fichier (PDF, Doc, Image...)</label>
                <div className="mt-1 flex items-center">
                    <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors w-full sm:w-auto">
                        <PaperClipIcon className="h-5 w-5 mr-2" />
                        {attachment ? attachment.name : "Choisir un fichier"}
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    {attachment && (
                        <button 
                            type="button" 
                            onClick={() => setAttachment(null)} 
                            className="ml-2 text-red-400 hover:text-red-300"
                        >
                            <XCircleIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Notification Email */}
            <div className="bg-gray-800 p-3 rounded-md border border-gray-700 mt-4">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="email-notif"
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-600 bg-gray-700 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="email-notif" className="font-medium text-gray-200 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                            Envoyer une notification par email
                        </label>
                        {sendEmail && (
                             <p className="text-primary-400 mt-1">
                                {emailRecipientsCount > 0 
                                    ? `Cela enverra un email à environ ${emailRecipientsCount} parents du groupe.` 
                                    : "Aucun parent de ce groupe n'a activé les notifications email."}
                             </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section Planification */}
            <div className="border-t border-gray-700 pt-4 mt-6">
                <h3 className="text-lg font-semibold text-primary-400 flex items-center mb-3">
                    <ClockIcon className="h-5 w-5 mr-2" /> Planification & Rappels
                </h3>
                
                <div className="mt-4 space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                    {/* Envoi différé */}
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="schedule"
                                type="checkbox"
                                checked={isScheduled}
                                onChange={(e) => setIsScheduled(e.target.checked)}
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-600 bg-gray-700 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="schedule" className="font-medium text-gray-200">Publier plus tard</label>
                            <p className="text-gray-400">Le message sera visible uniquement à partir de la date choisie.</p>
                        </div>
                    </div>
                    
                    {isScheduled && (
                        <div className="ml-7">
                            <input 
                                type="datetime-local" 
                                required={isScheduled}
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className={`${inputClasses} sm:w-auto`}
                            />
                        </div>
                    )}

                    {/* Date de l'événement */}
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-300 flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" /> Date de l'événement (optionnel)
                        </label>
                        <input 
                            type="date" 
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className={`${inputClasses} sm:w-auto`}
                        />
                    </div>

                    {/* Rappels automatiques */}
                    <div className={`flex items-start ${!eventDate ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex items-center h-5">
                            <input
                                id="reminders"
                                type="checkbox"
                                checked={autoReminders}
                                onChange={(e) => setAutoReminders(e.target.checked)}
                                disabled={!eventDate}
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-600 bg-gray-700 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="reminders" className="font-medium text-gray-200">Activer les rappels automatiques</label>
                            <p className="text-gray-400">Envoie automatiquement une notification à <strong className="text-primary-400">J-7</strong> et <strong className="text-primary-400">J-3</strong> avant la date de l'événement.</p>
                        </div>
                    </div>
                </div>
            </div>

          </form>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end space-x-3 bg-gray-900 rounded-b-lg">
          <button 
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Annuler
          </button>
          <button 
            type="submit"
            form="new-message-form"
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-lg shadow-primary/30">
            {isScheduled ? 'Programmer' : 'Publier'}
          </button>
        </div>
      </div>
    </div>
  );
};
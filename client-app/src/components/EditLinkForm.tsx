import React, { useState } from 'react';
import { updateLink, type LinkDto, type UpdateLinkData } from '../services/apiService';

interface EditLinkFormProps {
  link: LinkDto;
  onLinkUpdated: (updatedLink: LinkDto) => void;
  onCancel: () => void;
}

function EditLinkForm({ link, onLinkUpdated, onCancel }: EditLinkFormProps) {
  const [title, setTitle] = useState(link.title || '');
  const [description, setDescription] = useState(link.description || '');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const updateData: UpdateLinkData = { title, description };

    try {
      const updatedLink = await updateLink(link.id, updateData);
      onLinkUpdated(updatedLink); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-link-form">
      <h2>Editar Link</h2>
      <div className="form-group">
        <label>URL (não pode ser alterada)</label>
        <input 
          type="url"
          value={link.url}
          disabled 
        />
      </div>
      <div className="form-group">
        <label>Título</label>
        <input 
          type="text"
          placeholder="Título do link"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label>Descrição (Opcional)</label>
        <textarea
          rows={3}
          placeholder="Um breve resumo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'A Guardar...' : 'Guardar Alterações'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
      </div>
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
    </form>
  );
}

export default EditLinkForm;
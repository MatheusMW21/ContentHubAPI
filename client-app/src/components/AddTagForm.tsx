import React, { useState } from 'react';
import { addTagToLink, type LinkDto } from '../services/apiService';

interface AddTagFormProps {
  linkId: number;
  onTagAdded: (updatedLink: LinkDto) => void;
  onCancel: () => void;
}

function AddTagForm({ linkId, onTagAdded, onCancel }: AddTagFormProps) {
  const [tagName, setTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tagName.trim()) return; 
    
    setIsSubmitting(true);
    try {
      const updatedLink = await addTagToLink(linkId, tagName);
      onTagAdded(updatedLink);
      setTagName(''); 
    } catch (error) {
      console.error("Erro ao adicionar tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <form onSubmit={handleSubmit} className="add-tag-form">
      <input 
        type="text" 
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
        placeholder="Nova tag..."
        disabled={isSubmitting}
        autoFocus 
      />
      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>Adicionar</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
      </div>
    </form>
  );
}

export default AddTagForm;
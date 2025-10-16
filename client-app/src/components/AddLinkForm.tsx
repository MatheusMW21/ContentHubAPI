import React, { useState } from "react";
import { addLink } from "../services/apiService";
import type { LinkDto } from "../services/apiService";

interface AddLinkFormProps {
    onLinkAdded: (newLink: LinkDto) => void;
}

function AddLinkForm({ onLinkAdded }: AddLinkFormProps) {
    const [url, setUrl] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const newLink = await addLink({url, description});
      onLinkAdded(newLink); 
      setUrl(''); 
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <form onSubmit={handleSubmit} className="add-link-form">
      <h2>Adicionar Novo Link</h2>
      <div className="form-group">
        <label>URL</label>
        <input 
          type="url"
          placeholder="https://exemplo.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label>Descrição (Opcional)</label>
        <textarea
          rows={3}
          placeholder="Um breve resumo sobre o conteúdo do link..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'A Adicionar...' : 'Adicionar Link'}
      </button>
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
    </form>
  );
}

export default AddLinkForm;
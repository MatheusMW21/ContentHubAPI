import React, { useState } from 'react';
import type { LinkDto } from '../services/apiService';
import AddTagForm from './AddTagForm';
import { FaTrash, FaCheck } from 'react-icons/fa'; 

interface LinkItemProps {
  link: LinkDto;
  onTagAdded: (updatedLink: LinkDto) => void;
  onTagClick: (tagName: string) => void;
  onLinkDeleted: (linkId: number) => void;
  onToggleRead: (linkId: number) => void; 
}

function LinkItem({ link, onTagAdded, onTagClick, onLinkDeleted, onToggleRead }: LinkItemProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleTagAdded = (updatedLink: LinkDto) => {
    onTagAdded(updatedLink); 
    setIsAddingTag(false);  
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Tem a certeza que quer apagar o link: "${link.title || link.url}"?`)) {
      onLinkDeleted(link.id);
    }
  };

  return (
    <li className={`link-item ${link.isRead ? 'is-read' : ''}`}>
      <div className="link-item-header">
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          {link.title || link.url}
        </a>
        
        <div className="link-actions">
          <button onClick={() => onToggleRead(link.id)} className="icon-button primary">
            <FaCheck />
          </button>
          <button onClick={handleDeleteClick} className="icon-button danger">
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="tags-container">
        {link.tags.map(tag => (
          <span 
            key={tag.id} 
            className="tag-item clickable"
            onClick={() => onTagClick(tag.name)}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div className="add-tag-section">
        {isAddingTag ? (
          <AddTagForm 
            linkId={link.id} 
            onTagAdded={handleTagAdded}
            onCancel={() => setIsAddingTag(false)}
          />
        ) : (
          <button 
            className="add-tag-button"
            onClick={() => setIsAddingTag(true)}
          >
            + Adicionar Tag
          </button>
        )}
      </div>
    </li>
  );
}

export default LinkItem;
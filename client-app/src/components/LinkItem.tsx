import React, { useState } from 'react';
import type { LinkDto } from '../services/apiService';
import AddTagForm from './AddTagForm';

interface LinkItemProps {
  link: LinkDto;
  onTagAdded: (updatedLink: LinkDto) => void;
  onTagClick: (tagName: string) => void;
}

function LinkItem({ link, onTagAdded, onTagClick }: LinkItemProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const handleTagAdded = (updatedLink: LinkDto) => {
    onTagAdded(updatedLink);
    setIsAddingTag(false);
  };

  return (
    <li className="link-item">
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.title || link.url}
      </a>
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
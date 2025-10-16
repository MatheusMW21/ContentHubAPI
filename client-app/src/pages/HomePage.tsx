import React, { useState, useEffect } from 'react';
import { getLinks, type LinkDto } from '../services/apiService';
import AddLinkForm from '../components/AddLinkForm';
import Modal from '../components/Modal';
import LinkItem from '../components/LinkItem';

function HomePage() {
  const [links, setLinks] = useState<LinkDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getLinks(filterTag);
        setLinks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [filterTag]);

  const handleLinkAdded = (newLink: LinkDto) => {
    if (!filterTag) {
      setLinks(prevLinks => [newLink, ...prevLinks]);
    } else {
      setFilterTag(null);
    }
    setIsModalOpen(false);
  };

  const handleTagAddedToLink = (updatedLink: LinkDto) => {
    setLinks(currentLinks =>
      currentLinks.map(link =>
        link.id === updatedLink.id ? updatedLink : link
      )
    );
  };

  const handleTagClick = (tagName: string) => {
    setFilterTag(tagName);
  };

  const handleClearFilter = () => {
    setFilterTag(null);
  };

  if (loading) return <p>A carregar links...</p>;
  if (error) return <p style={{ color: 'var(--danger-color)' }}>Erro: {error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>{filterTag ? `Links com a tag "${filterTag}"` : 'Links Salvos'}</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          Adicionar Novo Link
        </button>
      </div>
      {filterTag && (
        <button onClick={handleClearFilter} className="btn-secondary">
          Mostrar Todos os Links
        </button>
      )}

      {links.length === 0 && !loading ? (
        <p>Nenhum link encontrado.</p>
      ) : (
        <ul className="links-list">
          {links.map(link => (
            <LinkItem key={link.id} link={link} onTagAdded={() => { }} onTagClick={handleTagClick} />
          ))}
        </ul>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddLinkForm onLinkAdded={handleLinkAdded} />
      </Modal>
    </div>
  );
}

export default HomePage;
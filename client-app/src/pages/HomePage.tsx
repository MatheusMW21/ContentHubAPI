import React, { useState, useEffect, useMemo } from 'react';
import { getLinks, deleteLink, toggleReadStatus, type LinkDto } from '../services/apiService';
import AddLinkForm from '../components/AddLinkForm';
import Modal from '../components/Modal';
import LinkItem from '../components/LinkItem';

function HomePage() {
  const [links, setLinks] = useState<LinkDto[]>([]); 
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    if (filterTag) {
      setFilterTag(null);
    } else {
      setLinks(prevLinks => [newLink, ...prevLinks]);
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

  const handleLinkDeleted = async (linkId: number) => {
    try {
      await deleteLink(linkId);
      setLinks(currentLinks => currentLinks.filter(link => link.id !== linkId));
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const handleToggleRead = async (linkId: number) => {
    try {
      const updatedLink = await toggleReadStatus(linkId);
      setLinks(currentLinks =>
        currentLinks.map(link =>
          link.id === updatedLink.id ? updatedLink : link
        )
      );
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const unreadLinks = useMemo(() => {
    return links.filter(link => !link.isRead);
  }, [links]);

  const readLinks = useMemo(() => {
    return links.filter(link => link.isRead);
  }, [links]);

  const handleLinkUpdated = (updatedLink: LinkDto) => {
    setLinks(currentLinks =>
      currentLinks.map(link =>
        link.id === updatedLink.id ? updatedLink : link
      )
    );
  }

  if (loading) return <div className="container"><p>A carregar links...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'red' }}>Erro: {error}</p></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h2>{filterTag ? `Links com a tag "${filterTag}"` : 'Links Salvos'}</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          Adicionar Novo Link
        </button>
      </div>

      {filterTag && (
        <button onClick={handleClearFilter} className="btn-secondary" style={{ marginBottom: '1rem' }}>
          Mostrar Todos os Links
        </button>
      )}

      {unreadLinks.length === 0 && !loading && !filterTag ? (
        <p>Nenhum link encontrado. Adicione um novo!</p>
      ) : (
        <ul className="links-list">
          {unreadLinks.map(link => (
            <LinkItem 
              key={link.id} 
              link={link} 
              onTagAdded={handleTagAddedToLink} 
              onTagClick={handleTagClick}
              onLinkDeleted={handleLinkDeleted}
              onToggleRead={handleToggleRead} 
              onLinkUpdated={handleLinkUpdated}
            />
          ))}
        </ul>
      )}

      {readLinks.length > 0 && !filterTag && (
        <>
          <h2 style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            Lidos
          </h2>
          <ul className="links-list">
            {readLinks.map(link => (
              <LinkItem 
                key={link.id} 
                link={link} 
                onTagAdded={handleTagAddedToLink} 
                onTagClick={handleTagClick}
                onLinkDeleted={handleLinkDeleted}
                onToggleRead={handleToggleRead} 
                onLinkUpdated={handleLinkUpdated}
              />
            ))}
          </ul>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddLinkForm onLinkAdded={handleLinkAdded} />
      </Modal>
    </div>
  );
}

export default HomePage;
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

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinks();
        setLinks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleLinkAdded = (newLink: LinkDto) => {
    setLinks(prevLinks => [newLink, ...prevLinks]);
    setIsModalOpen(false); 
  };

  const handleTagAddedToLink = (updatedLink: LinkDto) => {
    setLinks(currentLinks => 
      currentLinks.map(link => 
        link.id === updatedLink.id ? updatedLink : link
      )
    );
  };

  if (loading) return <p>A carregar links...</p>;
  if (error) return <p style={{ color: 'var(--danger-color)' }}>Erro: {error}</p>;

return (
    <div>
      <div className="page-header">
        <h2>Links Salvos</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          Adicionar Novo Link
        </button>
      </div>

      {links.length === 0 ? (
        <p>Nenhum link salvo ainda.</p>
      ) : (
        <ul className="links-list">
          {links.map(link => (
            <LinkItem key={link.id} link={link} onTagAdded={handleTagAddedToLink} />
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
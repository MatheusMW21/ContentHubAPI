import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <h2>O seu hub de conteúdo centralizado</h2>
      <p>
        Salve artigos, vídeos e o que mais encontrar na web.
        Organize tudo com tags, filtre e encontre o que precisa, quando precisa.
      </p>
      
      <ul className="features-list">
        <li>Salve qualquer link com um clique.</li>
        <li>Extração automática de títulos.</li>
        <li>Sistema de tags flexível e com filtros.</li>
        <li>Marque links como "lidos" e mantenha a sua lista organizada.</li>
      </ul>
      
      <Link to="/register" className="btn-primary" style={{ fontSize: '1.2em', marginTop: '1.5rem' }}>
        Comece a usar gratuitamente
      </Link>
    </div>
  );
}

export default LandingPage;
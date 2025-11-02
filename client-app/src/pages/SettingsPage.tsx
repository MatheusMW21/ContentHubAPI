import { Link } from 'react-router-dom'; 

function SettingsPage() {
  return (
    <div className="container">
      <h2>Configurações do Utilizador</h2>
      <p>Em breve: Aqui você poderá alterar a sua senha.</p>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/dashboard" className="btn-secondary">
          &larr; Voltar para os links
        </Link>
      </div>
    </div>
  );
}

export default SettingsPage;
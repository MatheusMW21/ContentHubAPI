export interface TagDto {
    id: number,
    name: string;
}

export interface LinkDto {
    id: number,
    url: string,
    title: string | null;
    description: string | null;
    addedOn: string;
    isRead: boolean;
    tags: TagDto[];
}

export interface UpdateLinkData {
    title: string | null;
    description: string | null;
}

const API_BASE_URL = 'https://localhost:7014/api';

export const registerUser = async (username: string, password: string, passwordConfirmation: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, passwordConfirmation }),
    });

    if (!response.ok) {
        throw new Error('Erro ao registrar o usuário.');
    }
}


export const getLinks = async (tagName: string | null): Promise<LinkDto[]> => {
    const token = localStorage.getItem('jwt_token');

    if(!token) {
        throw new Error('Nenhum token de autenticação encontrado.');
    }

    const url = new URL(`${API_BASE_URL}/Links`);
    if(tagName) {
      url.searchParams.append('tag', tagName);
    }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar os links.');
    }

    return await response.json() as LinkDto[];
}

export const addLink = async (linkData: { url: string; description?: string }): Promise<LinkDto> => {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    window.location.href = '/login';
    throw new Error('Nenhum token de autenticação encontrado.');
  }

  const response = await fetch(`${API_BASE_URL}/Links`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(linkData), 
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erro da API:", errorData);
    throw new Error('Falha ao adicionar o link. Verifique a consola para mais detalhes.');
  }

  return await response.json() as LinkDto;
};

export const addTagToLink = async (linkId: number, tagName: string): Promise<LinkDto> => {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    window.location.href = '/login';
    throw new Error('Nenhum token de autenticação encontrado.');
  }

  const response = await fetch(`${API_BASE_URL}/Links/${linkId}/tags`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tagName }),
  });

  if (!response.ok) {
    throw new Error('Falha ao adicionar a tag.');
  }

  return await response.json() as LinkDto;
};

export const deleteLink = async (linkId: number): Promise<void> => {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    window.location.href = '/login';
    throw new Error('Nenhum token de autenticação encontrado.');
  }

  const response = await fetch(`${API_BASE_URL}/Links/${linkId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }

  if (!response.ok) {
    throw new Error('Falha ao deletar o link.');
  }
}

export const toggleReadStatus = async (linkId: number): Promise<LinkDto> => {
  const token = localStorage.getItem('jwt_token');
  
  if (!token) {
    window.location.href = '/login';
    throw new Error('Nenhum token de autenticação encontrado.');
  }

  const response = await fetch(`${API_BASE_URL}/Links/${linkId}/toggle-read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }

  if (!response.ok) {
    throw new Error('Falha ao atualizar o status de leitura.');
  }

  return await response.json() as LinkDto;
};

export const updateLink = async (linkId: number, updateData: UpdateLinkData): Promise<LinkDto> => {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    window.location.href = '/login';
    throw new Error('Nenhum token de autenticação encontrado.');
  }

  const response = await fetch(`${API_BASE_URL}/Links/${linkId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error('Falha ao atualizar o link.');
  }

  return await response.json() as LinkDto;
};
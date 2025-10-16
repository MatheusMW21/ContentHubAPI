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

const API_BASE_URL = 'https://localhost:7014/api';

export const getLinks = async (): Promise<LinkDto[]> => {
    const token = localStorage.getItem('jwt_token');

    if(!token) {
        throw new Error('Nenhum token de autenticação encontrado.');
    }

    const response = await fetch(`${API_BASE_URL}/Links`, {
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
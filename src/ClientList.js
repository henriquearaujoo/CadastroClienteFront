import React, { useState, useEffect } from 'react';
import ClientForm from './ClientForm';
import axios from 'axios';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    // Função para buscar a lista de clientes
    const fetchClients = async () => {
        try {
            const response = await axios.get('https://localhost:7244/api/Clientes');
            setClients(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    // Chamar fetchClients assim que o componente é montado
    useEffect(() => {
        fetchClients();
    }, []);

    const handleClientSaved = () => {
        // Recarregar a lista de clientes após adicionar ou editar
        fetchClients();
        setSelectedClient(null); // Limpar o cliente selecionado após salvar
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7244/api/Clientes/${id}`);
            fetchClients(); // Atualizar a lista após a exclusão
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
        }
    };

    return (
        <div>
            {/* Renderizando o formulário apenas uma vez */}
            <ClientForm selectedClient={selectedClient} onClientSaved={handleClientSaved} />

            <h2>Lista de Clientes</h2>
            <ul>
                {clients.map((client) => (
                    <li key={client.id}>
                        {client.nomeEmpresa} - {client.porte}
                        <button onClick={() => setSelectedClient(client)}>Editar</button>
                        <button
                            onClick={() => handleDelete(client.id)}
                            style={{ marginLeft: '10px', color: 'red' }}>
                            Excluir
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientList;

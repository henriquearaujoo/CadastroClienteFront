import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientForm = ({ selectedClient, onClientSaved }) => {
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [porte, setPorte] = useState('pequena');
    const [error, setError] = useState(null); // Adicionando tratamento de erro

    useEffect(() => {
        if (selectedClient) {
            setNomeEmpresa(selectedClient.nomeEmpresa);
            setPorte(selectedClient.porte);
        } else {
            // Limpar os campos ao desmarcar o cliente selecionado
            setNomeEmpresa('');
            setPorte('pequena');
        }
    }, [selectedClient]);

    const handleSave = async () => {
        if (!nomeEmpresa) {
            setError('O nome da empresa é obrigatório.');
            return;
        }

        const clientData = { id: selectedClient?.id, nomeEmpresa, porte };

        try {
            if (selectedClient) {
                // Editar cliente
                await axios.put(`https://localhost:7244/api/Clientes/${selectedClient.id}`, clientData);
            } else {
                // Adicionar novo cliente
                await axios.post('https://localhost:7244/api/Clientes', clientData);
            }

            onClientSaved(); // Chama a função no componente pai para atualizar a lista de clientes

            // Limpar formulário após salvar
            setNomeEmpresa('');
            setPorte('pequena');
            setError(null); // Limpar erros após sucesso
        } catch (error) {
            console.error('Erro ao salvar o cliente:', error.response || error);
            setError('Ocorreu um erro ao salvar o cliente.');
        }
    };

    return (
        <div>
            <h2>{selectedClient ? 'Editar Cliente' : 'Adicionar Cliente'}</h2>
            <input
                type="text"
                placeholder="Nome da Empresa"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
            />
            <select value={porte} onChange={(e) => setPorte(e.target.value)}>
                <option value="pequena">Pequena</option>
                <option value="media">Media</option>
                <option value="grande">Grande</option>
            </select>
            <button onClick={handleSave}>{selectedClient ? 'Salvar' : 'Adicionar'}</button>

            {/* Mostrar mensagens de erro se houver */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ClientForm;
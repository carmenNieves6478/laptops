import React, { useState, useEffect } from 'react';

interface Client {
    id: number;
    nombre: string;
    ruc_dni: string;
    direccion: string;
}

interface ClientFormProps {
    onClientSelect: (client: Client) => void;
}

export default function ClientForm({ onClientSelect }: ClientFormProps) {
    const [documentType, setDocumentType] = useState<'dni' | 'ruc'>('dni');
    const [documentNumber, setDocumentNumber] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const response = await fetch('/api/clients');
        const data = await response.json();
        setClients(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const clientData = {
            nombre: name,
            ruc_dni: documentNumber,
            direccion: address
        };

        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });

        if (response.ok) {
            const newClient = await response.json();
            fetchClients();
            onClientSelect({
                id: newClient.insertId,
                ...clientData
            });
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Datos del Cliente</h3>

            <div className="mb-4">
                <select
                    className="w-full p-2 border rounded"
                    value={selectedClient ? 'existing' : 'new'}
                    onChange={(e) => {
                        if (e.target.value === 'new') {
                            setSelectedClient(null);
                        }
                    }}
                >
                    <option value="new">Nuevo Cliente</option>
                    <option value="existing">Cliente Existente</option>
                </select>
            </div>

            {selectedClient ? (
                <div className="mb-4">
                    <select
                        className="w-full p-2 border rounded"
                        onChange={(e) => {
                            const client = clients.find(c => c.id === parseInt(e.target.value));
                            if (client) {
                                setSelectedClient(client);
                                onClientSelect(client);
                            }
                        }}
                    >
                        <option value="">Seleccionar cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.nombre} - {client.ruc_dni}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <select
                            className="w-full p-2 border rounded"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value as 'dni' | 'ruc')}
                        >
                            <option value="dni">DNI</option>
                            <option value="ruc">RUC</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Número de documento"
                            className="w-full p-2 border rounded"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            maxLength={documentType === 'dni' ? 8 : 11}
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Nombre/Razón Social"
                            className="w-full p-2 border rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Dirección"
                            className="w-full p-2 border rounded"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Guardar Cliente
                    </button>
                </form>
            )}
        </div>
    );
}
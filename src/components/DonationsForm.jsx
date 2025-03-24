import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';
import '../css/DonationForm.css';
import { postServerData } from '../helpers/ServerCalling';
import { validarDonacion } from '../helpers/Validations';

const DonationForm = () => {
    const [amount, setAmount] = useState('100');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [idPreference, setIdPreference] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarDonacion(amount)) {
            setError('El monto de la donación debe ser un número válido mayor o igual a 100.');
            return;
        }

        await createDonation();
    };

    const createDonation = async () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const returnUrl = `${window.location.origin}/pagos/result`;

        const formData = {
            amount: Number(amount),
            paymentMethod: 'mercadoPago',
            returnUrl,
        };

        try {
            const responseMP = await postServerData(apiUrl, "/contacto/donation", formData);

            if (responseMP.statusCode == 200 && responseMP.url) {
                setIdPreference(responseMP.url);
                initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
                setShowModal(true);
            } else {
                setError('Error al obtener la preferencia de pago.');
                setMessage('');
            }
        } catch (error) {
            console.error('Error al enviar la donación:', error);
            setError('Hubo un problema al procesar tu donación. Por favor, intenta de nuevo más tarde.');
            setMessage('');
        }
    };

    const handlePaymentSuccess = () => {
        setMessage('¡Gracias por tu generosa donación! Todas las vidas de los animales importan.');
        setError('');
        setAmount('');
        setShowModal(false);
    };

    return (
        <div className="donation-form-container">
            <h2>¡Haz una diferencia!</h2>
            <p>Tu donación ayuda a cuidar y salvar la vida de muchos animales necesitados. Gracias por tu generosidad.</p>
            <form onSubmit={handleSubmit} className="donation-form">
                <label>
                    Monto de la donación:
                    <input
                        id='donatio-input'
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="donation-input text-center"
                        min={100}
                        step={50}
                    />
                </label>
                <button type="submit" className="donation-button">Donar</button>
            </form>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona Método de Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Estás a punto de donar ${amount}. Por favor, elige tu método de pago.</p>
                    {idPreference && (
                        <Wallet initialization={{ preferenceId: idPreference, redirectMode: 'self' }} customization={{ texts: { valueProp: 'smart_option' } }} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DonationForm;
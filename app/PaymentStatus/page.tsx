"use client";

import React, { useEffect } from "react";
import Swal from "sweetalert2";

const PaymentStatus: React.FC = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const message = urlParams.get('message');

        if (status && message) {
            Swal.fire({
                title: status === 'success' ? 'Éxito' : 'Error',
                text: message,
                icon: status === 'success' ? 'success' : 'error',
                confirmButtonText: 'Ok',
            });
        }
    }, []);

    return (
        <div>
            
            <h2>Procesando tu pago...</h2>
        </div>
    );
};

export default PaymentStatus;

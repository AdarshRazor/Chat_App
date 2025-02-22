import { useState, useEffect } from 'react';
import { baseUrl, getRequest } from '../utils/services';

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;

            try {
                const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
                
                if (response.error) {
                    setError(response.error);
                } else {
                    console.log("Response from API:", response);
                    setRecipientUser(response);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        getUser();
    }, [recipientId]);

    return { recipientUser, error };
};

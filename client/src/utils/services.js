export const baseUrl = "http://localhost:5000/api"

export const postRequest = async(url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    const data = await response.json()

    // to check the error
    if(!response.ok){
        let message;

        if (data?.message){
            message = data.message;
        } else {
            message = data;
        }

        return { error: true, message};
    }

    return data
};

// perfomr a get req so we can get the message

export const getRequest = async(url) => {
    const response = await fetch(url) 
    //remove the following comments if code dosent work
    // ,{
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // })

    const data = await response.json()

    // to check the error
    if(!response.ok){
        let message = "An error occurred";

        if (data?.message){
            message = data.message;}
        // } else {
        //     message = data;
        // }

        return { error: true, message};
    }

    return data
};
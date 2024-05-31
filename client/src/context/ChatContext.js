import { createContext, useState, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const ChatContext = createContext()

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)

    // perform http request and get the user from backend api (useeffect hook)
    useEffect(() => {
        const getUserChats = async () => {
            if(user?._id){

                setIsUserChatsLoading(true)
                // reset the error every time we send a message
                setUserChatsError(null)

                // this response can have error or success
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)

                setIsUserChatsLoading(false)

                if(response.error){
                    // remove .error if ut throw error or add .error in response
                    return setUserChatsError(response)
                }
                setUserChats(response)
            }
        }
        getUserChats()
    }, [user])

    return <ChatContextProvider value={{
        userChats,
        isUserChatsLoading,
        userChatsError
    }}>
        {children}
    </ChatContextProvider>
}
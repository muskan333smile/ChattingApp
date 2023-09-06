import {createContext, useCallback, useEffect, useState} from 'react'
import {baseUrl, getRequest,postRequest} from "../utils/services"

import {io} from 'socket.io-client'


export const ChatContext = createContext();

export const ChatContextProvider = ({children,user})=>{

    const [userChats, setUserChats]= useState(null);
    const[isUserChatsLoading, setIsUseChatsLoading] = useState(false);
    const[userChatsError, setUserChatsError] = useState(null);
    const[potentialChats, setPotentialChats] = useState([]);
    const[currentChats, setCurrentChats] = useState(null);
    const [messages, setMessages]= useState(null);
    const[isMessagesLoading, setIsMessagesLoading] = useState(false);
    const[messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null);
    const[socket,setSocket] = useState(null);
    const[onlineUsers, setOnlineUsers] = useState([])
    
    // console.log("current chat",currentChats);
    console.log("onlineusers",onlineUsers);

    useEffect(()=>{
        const newSocket = io("http://localhost:8080");
        setSocket(newSocket);

        return ()=>{
            newSocket.disconnect()
        }
    },[user]);

     useEffect(()=>{
         if(socket===null) return;
         socket.emit("addNewUser",user?._id);
         socket.on("getOnlineUsers",(res)=>{
             setOnlineUsers(res);

         })

         return()=>{
            socket.off("getOnlineUsers")
         }
     },[socket]);

     //send msg
     useEffect(()=>{
        if(socket===null) return;

        const recipientId = currentChats?.members.find((id)=> id!== user?._id)

        socket.emit("sendMessage",{...newMessage, recipientId});
    },[newMessage]);

    //recive msg
    useEffect(()=>{
        if(socket===null) return;

        socket.on("getMessage",res =>{
            if(currentChats?._id !== res.chatId)
            {
                return
            }

            setMessages((prev)=>[...prev, res])

        })

        return ()=>{
            socket.off("getMessage")
        }
    },[socket,currentChats]);




    useEffect(()=>{
        const getUsers = async()=>{
            const response = await getRequest(`${baseUrl}/users`)
            if(response.error)
            {
                return console.log("Errorvfetching",response)


            }
            const pChats = response.filter((u)=>{
                let isChatCreated = false;
                if(user?._id ===u?._id )
                {
                    return false;
                }

                if(userChats)
                {
                    isChatCreated = userChats?.some((chat)=>{
                        return chat.members[0] ===u._id || chat.members[1] ===u._id
                    })
                }

                return !isChatCreated


            })
            setPotentialChats(pChats)

        }
        getUsers();
    },[userChats])

    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){

                setIsUseChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)
                setIsUseChatsLoading(false);
                if(response.error)
                {
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }

        getUserChats();
    },[user])


    useEffect(()=>{
        const getMessages = async()=>{

            

                setIsMessagesLoading(true);
                setMessagesError(null);
                const response = await getRequest(`${baseUrl}/messages/${currentChats?._id}`)
                setIsMessagesLoading(false);
                if(response.error)
                {
                    return setMessagesError(response);
                }
                setMessages(response);
            
        }


        getMessages();
    },[currentChats])

    const sendTextMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage)=>{
        if(!textMessage)
        {
            return console.log("you must type something..")
        }

        const response = await postRequest(`${baseUrl}/messages`,JSON.stringify({
            chatId : currentChatId,
            senderId : sender._id,
            text: textMessage
        }));

        if(response.error)
                {
                    return setSendTextMessageError(response);
                }

            setNewMessage(response);
            setMessages((prev)=>[...prev, response])
            setTextMessage("")


    },[])



    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChats(chat)

    },[])

    const createChat = useCallback(async(firstId, secondId)=>{
        const response = await postRequest(`${baseUrl}/chats`,JSON.stringify({firstId, secondId}))

        if(response.error)
        {
            return console.log("error creating chat",response);
        }

        setUserChats((prev)=>[...prev, response])
    },[])
    
    

    return<ChatContext.Provider value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChats,
        sendTextMessage,
        onlineUsers,
        
        

    }}>
        {children}
    </ChatContext.Provider>

}
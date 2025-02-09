export  const kafka_Const = {
    topics:{
        
        CHAT_SERVICE: process.env.CHAT_SERVICE || "chat-service",
        CHAT_UPDATE: process.env.CHAT_UPDATE || "chat.update",
        CHAT_ROLLBACK: process.env.CHAT_ROLLBACK || "chat-service.rollback",
        CHAT_RESPONSE: process.env.CHAT_RESPONSE || "chat.response",
        CHAT_ROLLBACK_COMPLETED : process.env.CHAT_ROLLBACK_COMPLETED || 'rollback-completed'
    },
    CHAT_SERVICE_GROUP_NAME: process.env.CHAT_SERVICE_GROUP || "chat-service-group",
}
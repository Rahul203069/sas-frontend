import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MessageBubble({ message }) {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-gray-600" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-3 rounded-3xl ${
            isBot
              ? "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
              : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none shadow-md"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.message}</p>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 px-2">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}
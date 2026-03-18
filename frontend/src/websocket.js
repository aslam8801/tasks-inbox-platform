import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onMessage) => {
  const socket = new SockJS("https://tasks-inbox-platform.onrender.com/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ WebSocket Connected");

      stompClient.subscribe("/topic/tasks", (message) => {
        const task = JSON.parse(message.body);
        onMessage(task);
      });
    },

    onStompError: (frame) => {
      console.error("❌ WebSocket Error:", frame);
    },
  });

  stompClient.activate();
};
package com.bengalishadi.connection;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket handler for live chat.
 * Clients connect to /ws/conversations/{conversationId}.
 * New messages are broadcast to all connected participants.
 */
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketHandler.class);
    private final ObjectMapper objectMapper;

    // Map of conversationId → set of active WebSocket sessions
    private final Map<Long, Set<WebSocketSession>> conversationSessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Long conversationId = extractConversationId(session);
        if (conversationId != null) {
            conversationSessions.computeIfAbsent(conversationId, k -> ConcurrentHashMap.newKeySet()).add(session);
            log.info("WebSocket connected: conversation={}, session={}", conversationId, session.getId());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Long conversationId = extractConversationId(session);
        if (conversationId != null) {
            Set<WebSocketSession> sessions = conversationSessions.get(conversationId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) conversationSessions.remove(conversationId);
            }
            log.info("WebSocket disconnected: conversation={}, session={}", conversationId, session.getId());
        }
    }

    /**
     * Broadcast a new message to all connected participants of a conversation.
     */
    public void broadcast(Long conversationId, ChatMessage message) {
        Set<WebSocketSession> sessions = conversationSessions.get(conversationId);
        if (sessions == null || sessions.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(message);
            TextMessage textMessage = new TextMessage(json);
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(textMessage);
                    } catch (IOException e) {
                        log.error("Failed to send WebSocket message to session {}", session.getId(), e);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to serialize message for broadcast", e);
        }
    }

    private Long extractConversationId(WebSocketSession session) {
        String path = session.getUri() != null ? session.getUri().getPath() : "";
        // Path format: /ws/conversations/{conversationId}
        String[] parts = path.split("/");
        if (parts.length >= 4) {
            try {
                return Long.parseLong(parts[3]);
            } catch (NumberFormatException e) {
                log.warn("Invalid conversationId in WebSocket path: {}", path);
            }
        }
        return null;
    }
}

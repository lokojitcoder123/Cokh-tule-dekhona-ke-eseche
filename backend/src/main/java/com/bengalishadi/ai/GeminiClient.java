package com.bengalishadi.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * AI client using OpenRouter (OpenAI-compatible API).
 * Reads config from app.ai.* properties in application.properties.
 * Supports any OpenRouter model (DeepSeek, Llama, GPT, etc.)
 */
@Component
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.base-url:https://openrouter.ai/api/v1}")
    private String baseUrl;

    @Value("${app.ai.model:deepseek/deepseek-chat-v3-0324}")
    private String modelName;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Send a prompt to the AI and return the generated text response.
     * Uses OpenAI-compatible /chat/completions endpoint.
     */
    public String generate(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException(
                "AI API key not configured. Set OPENROUTER_API_KEY env var or app.ai.api-key in application.properties.");
        }

        try {
            // Build OpenAI-compatible request body
            ObjectNode message = objectMapper.createObjectNode();
            message.put("role", "user");
            message.put("content", prompt);

            ArrayNode messages = objectMapper.createArrayNode();
            messages.add(message);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", modelName);
            requestBody.set("messages", messages);

            String body = objectMapper.writeValueAsString(requestBody);

            String completionsUrl = baseUrl.replaceAll("/$", "") + "/chat/completions";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(completionsUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("HTTP-Referer", "http://localhost:5173")  // Required by OpenRouter
                    .header("X-Title", "Bengali Shadi")               // Required by OpenRouter
                    .timeout(Duration.ofSeconds(60))
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("AI API error {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("AI API error (Status " + response.statusCode() + "): " + response.body());
            }

            // Parse response: choices[0].message.content
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }

            throw new RuntimeException("Unexpected AI response format: " + response.body());

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("AI API call failed", e);
            throw new RuntimeException("AI API call failed: " + e.getMessage(), e);
        }
    }
}

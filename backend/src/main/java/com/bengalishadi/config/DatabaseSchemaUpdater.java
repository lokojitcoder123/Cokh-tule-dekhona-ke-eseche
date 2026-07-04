package com.bengalishadi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Automatically alters the profiles table on startup to convert profile_picture
 * to LONGTEXT. This bypasses Hibernate's default mapping limits and avoids
 * manual database migration commands for the user.
 */
@Component
public class DatabaseSchemaUpdater implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaUpdater.class);
    private final DataSource dataSource;

    public DatabaseSchemaUpdater(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        log.info("Starting automatic database schema migration for profiles.profile_picture...");
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            
            // Alter the column to LONGTEXT (allows storing up to 4GB Base64 strings)
            stmt.execute("ALTER TABLE profiles MODIFY COLUMN profile_picture LONGTEXT");
            log.info("Database schema migration successful: profiles.profile_picture is now LONGTEXT.");
            
        } catch (Exception e) {
            // Log as warning - might fail on first run if database/table is empty before Hibernate finishes
            log.warn("Database schema migration skipped or failed: {}", e.getMessage());
        }
    }
}

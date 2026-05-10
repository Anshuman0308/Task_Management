package com.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class TaskManagementApplication {
    public static void main(String[] args) {
        loadEnv(".env");
        SpringApplication.run(TaskManagementApplication.class, args);
    }

    private static void loadEnv(String filename) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;
                int idx = line.indexOf('=');
                if (idx < 0) continue;
                String key = line.substring(0, idx).trim();
                String value = line.substring(idx + 1).trim();
                if (System.getenv(key) == null) {
                    System.setProperty(key, value);
                }
            }
        } catch (IOException ignored) {
            // .env not present — rely on actual environment variables (e.g. in production)
        }
    }
}

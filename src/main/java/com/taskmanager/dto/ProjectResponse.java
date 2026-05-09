package com.taskmanager.dto;

import com.taskmanager.enums.Role;
import lombok.Data;

@Data
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String ownerEmail;
    private int memberCount;
    private int taskCount;
}

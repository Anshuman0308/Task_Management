package com.taskmanager.dto;

import com.taskmanager.enums.Role;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private int assignedTasks;
}

package com.taskmanager.dto;

import com.taskmanager.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private boolean overdue;
    private String assigneeEmail;
    private Long projectId;
    private String projectName;
}

package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank
    private String title;

    private String description;
    private LocalDate dueDate;
    private Long assigneeId;  // optional at creation
}

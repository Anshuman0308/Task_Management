package com.taskmanager.dto;

import com.taskmanager.enums.TaskStatus;
import lombok.Data;

@Data
public class TaskStatusRequest {
    private TaskStatus status;
}

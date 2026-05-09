package com.taskmanager.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponse {
    private int totalTasks;
    private int completed;
    private int inProgress;
    private int todo;
    private int overdue;
    private List<TaskResponse> tasks;
}

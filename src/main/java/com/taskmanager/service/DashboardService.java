package com.taskmanager.service;

import com.taskmanager.config.AuthHelper;
import com.taskmanager.dto.DashboardResponse;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.enums.Role;
import com.taskmanager.enums.TaskStatus;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final AuthHelper authHelper;
    private final TaskService taskService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        User user = authHelper.getCurrentUser();

        List<Task> tasks = user.getRole() == Role.ADMIN
                ? taskRepository.findAll()
                : taskRepository.findByAssigneeId(user.getId());

        List<TaskResponse> taskResponses = tasks.stream()
                .map(taskService::toResponse).toList();

        DashboardResponse dashboard = new DashboardResponse();
        dashboard.setTotalTasks(tasks.size());
        dashboard.setCompleted((int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE).count());
        dashboard.setInProgress((int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count());
        dashboard.setTodo((int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.TODO).count());
        dashboard.setOverdue((int) tasks.stream()
                .filter(t -> t.getDueDate() != null
                        && t.getDueDate().isBefore(LocalDate.now())
                        && t.getStatus() != TaskStatus.DONE)
                .count());
        dashboard.setTasks(taskResponses);

        return dashboard;
    }
}

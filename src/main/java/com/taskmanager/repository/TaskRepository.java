package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssigneeId(Long assigneeId);
    List<Task> findByAssigneeIdAndStatus(Long assigneeId, TaskStatus status);

    // Overdue: dueDate is before today and task is not DONE
    List<Task> findByAssigneeIdAndDueDateBeforeAndStatusNot(
            Long assigneeId, LocalDate date, TaskStatus status);

    List<Task> findByProjectIdAndDueDateBeforeAndStatusNot(
            Long projectId, LocalDate date, TaskStatus status);
}

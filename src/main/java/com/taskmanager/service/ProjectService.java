package com.taskmanager.service;

import com.taskmanager.config.AuthHelper;
import com.taskmanager.dto.AddMemberRequest;
import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.dto.ProjectResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.ProjectMember;
import com.taskmanager.entity.User;
import com.taskmanager.enums.Role;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final AuthHelper authHelper;

    public ProjectResponse createProject(ProjectRequest request) {
        User owner = authHelper.getCurrentUser();

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        project = projectRepository.save(project);

        // Owner is also a member with ADMIN role
        ProjectMember member = ProjectMember.builder()
                .user(owner)
                .project(project)
                .role(Role.ADMIN)
                .build();
        projectMemberRepository.save(member);

        return toResponse(project);
    }

    public List<ProjectResponse> getMyProjects() {
        User user = authHelper.getCurrentUser();

        if (user.getRole() == Role.ADMIN) {
            return projectRepository.findAll().stream().map(this::toResponse).toList();
        }
        return projectRepository.findProjectsByMemberId(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public ProjectResponse getProject(Long projectId) {
        return toResponse(findProjectById(projectId));
    }

    public void addMember(Long projectId, AddMemberRequest request) {
        Project project = findProjectById(projectId);

        User newMember = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        if (projectMemberRepository.existsByUserIdAndProjectId(newMember.getId(), projectId)) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .user(newMember)
                .project(project)
                .role(Role.MEMBER)
                .build();

        projectMemberRepository.save(member);
    }

    public void deleteProject(Long projectId) {
        Project project = findProjectById(projectId);
        projectRepository.delete(project);
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }

    private ProjectResponse toResponse(Project p) {
        ProjectResponse res = new ProjectResponse();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setDescription(p.getDescription());
        res.setOwnerEmail(p.getOwner().getEmail());
        res.setMemberCount(p.getMembers() != null ? p.getMembers().size() : 0);
        res.setTaskCount(p.getTasks() != null ? p.getTasks().size() : 0);
        return res;
    }
}

package com.example.tasks.service;

import com.example.tasks.model.Task;
import com.example.tasks.repository.TaskRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;
    private final SimpMessagingTemplate messagingTemplate;

    public TaskService(TaskRepository repo, SimpMessagingTemplate messagingTemplate) {
        this.repo = repo;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    public Task addTask(Task task) {
        Task saved = repo.save(task);

        // 🔥 REAL-TIME EVENT
        messagingTemplate.convertAndSend("/topic/tasks", saved);

        return saved;
    }

    public Task updateTask(String id, Task updatedTask) {
        return repo.findById(id).map(task -> {

            task.setTitle(updatedTask.getTitle());
            task.setStatus(updatedTask.getStatus());
            task.setPriority(updatedTask.getPriority());
            task.setType(updatedTask.getType());
            task.setPinned(updatedTask.isPinned());

            Task saved = repo.save(task);

            // 🔥 REAL-TIME EVENT
            messagingTemplate.convertAndSend("/topic/tasks", saved);

            return saved;

        }).orElse(null);
    }
}
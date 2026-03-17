package com.example.tasks.service;

import com.example.tasks.model.Task;
import com.example.tasks.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    public Task addTask(Task task) {
        return repo.save(task);
    }

    public Task updateTask(String id, Task updatedTask) {
        return repo.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setStatus(updatedTask.getStatus());
            task.setPriority(updatedTask.getPriority());
            task.setType(updatedTask.getType());
            task.setPinned(updatedTask.isPinned());
            return repo.save(task);
        }).orElse(null);
    }
}
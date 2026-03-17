package com.example.tasks.service;

import com.example.tasks.model.Task;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TaskService {

    private final List<Task> tasks = new ArrayList<>();

    public TaskService() {
        tasks.add(new Task(1L, "Approve leave request", "pending", "high", "HR", false));
        tasks.add(new Task(2L, "Review PR #142", "completed", "medium", "Engineering", true));
    }

    public List<Task> getAllTasks() {
        return tasks;
    }

    public Task addTask(Task task) {
        task.setId((long) (tasks.size() + 1));
        tasks.add(task);
        return task;
    }

    public Task updateTask(Long id, Task updatedTask) {
        for (Task t : tasks) {
            if (t.getId().equals(id)) {
                t.setTitle(updatedTask.getTitle());
                t.setStatus(updatedTask.getStatus());
                t.setPriority(updatedTask.getPriority());
                t.setType(updatedTask.getType());
                t.setPinned(updatedTask.isPinned());
                return t;
            }
        }
        return null;
    }
}
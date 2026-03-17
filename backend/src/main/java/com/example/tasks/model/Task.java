package com.example.tasks.model;

public class Task {

    private Long id;
    private String title;
    private String status;
    private String priority;
    private String type;
    private boolean pinned;

    // ✅ Default constructor
    public Task() {}

    // ✅ Parameterized constructor
    public Task(Long id, String title, String status, String priority, String type, boolean pinned) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.type = type;
        this.pinned = pinned;
    }

    // ✅ Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isPinned() { return pinned; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }
}
package com.example.tasks.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true) // 🔥 prevents crash from extra fields
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String title;
    private String status;
    private String priority;
    private String type;
    private boolean pinned;

    private Date snoozedUntil; // ✅ IMPORTANT (fixes your bug)

    public Task() {}

    public Task(String title, String status, String priority, String type, boolean pinned, Date snoozedUntil) {
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.type = type;
        this.pinned = pinned;
        this.snoozedUntil = snoozedUntil;
    }

    // 🔽 GETTERS & SETTERS

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public Date getSnoozedUntil() {
        return snoozedUntil;
    }

    public void setSnoozedUntil(Date snoozedUntil) {
        this.snoozedUntil = snoozedUntil;
    }
}
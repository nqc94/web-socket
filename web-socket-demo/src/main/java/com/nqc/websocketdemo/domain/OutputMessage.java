package com.nqc.websocketdemo.domain;

import java.util.Date;

public class OutputMessage {

    private String username;

    private String message;

    private Date date;

    public OutputMessage() {
    }

    public OutputMessage(String username, String message, Date date) {
        this.username = username;
        this.message = message;
        this.date = date;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}

package com.nqc.websocketdemo.domain;

import java.util.ArrayList;
import java.util.List;

public class CustomQueue<T> extends ArrayList<T> {

    private int maxSize;

    private CustomQueue() {
    }

    public CustomQueue(int size) {
        this.maxSize = size;
    }

    @Override
    public boolean add(T t) {
        boolean success = super.add(t);
        if (this.size() > this.maxSize) {
            this.removeRange(0, this.size() - this.maxSize);
        }
        return success;
    }

    public List<T> getElement(int size) {
        if (size > this.size()) {
            size = this.size();
        }
        List<T> q = new ArrayList<>(this.maxSize);
        for (int i = this.size() - size; i < this.size(); i++) {
            q.add(this.get(i));
        }
        return q;
    }
}

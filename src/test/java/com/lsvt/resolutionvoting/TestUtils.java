package com.lsvt.resolutionvoting;

import java.lang.reflect.Field;

public final class TestUtils {

    private TestUtils() {
    }

    public static <T> T setId(T entity, Long id) {
        try {
            Field field = entity.getClass().getDeclaredField("id");
            field.setAccessible(true);
            field.set(entity, id);
            return entity;
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new IllegalStateException("Failed to set id for test entity", e);
        }
    }
}


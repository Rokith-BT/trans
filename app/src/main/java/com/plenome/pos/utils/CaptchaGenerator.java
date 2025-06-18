package com.plenome.pos.utils;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;

import java.util.Random;

public class CaptchaGenerator {
    private static final int WIDTH = 300;
    private static final int HEIGHT = 100;
    private static final int TEXT_SIZE = 50;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private String captchaText;

    public Bitmap generateCaptcha() {
        Bitmap bitmap = Bitmap.createBitmap(WIDTH, HEIGHT, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint();

        // Background Color
        canvas.drawColor(Color.LTGRAY);

        // Generate random text
        captchaText = generateRandomText(6);

        // Set text properties
        paint.setColor(Color.BLACK);
        paint.setTextSize(TEXT_SIZE);
        paint.setTypeface(Typeface.DEFAULT_BOLD);

        // Draw text with random positions for distortion
        Random random = new Random();
        for (int i = 0; i < captchaText.length(); i++) {
            float x = 40 + (i * 40) + random.nextInt(15);
            float y = 50 + random.nextInt(20);
            canvas.drawText(String.valueOf(captchaText.charAt(i)), x, y, paint);
        }

        // Add random noise (lines)
        paint.setColor(Color.RED);
        paint.setStrokeWidth(3);
        for (int i = 0; i < 5; i++) {
            float startX = random.nextInt(WIDTH);
            float startY = random.nextInt(HEIGHT);
            float stopX = random.nextInt(WIDTH);
            float stopY = random.nextInt(HEIGHT);
            canvas.drawLine(startX, startY, stopX, stopY, paint);
        }

        return bitmap;
    }

    public String getCaptchaText() {
        return captchaText;
    }

    private String generateRandomText(int length) {
        Random random = new Random();
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            builder.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return builder.toString();
    }
}


package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class TranscriptResponse implements Serializable {

    @SerializedName("transcript")
    private String transcript;

    @SerializedName("language_code")
    private String languageCode;

    @SerializedName("error")
    private ErrorDetails error;

    // Getters and setters
    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public String getLanguageCode() {
        return languageCode;
    }

    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public ErrorDetails getError() {
        return error;
    }

    public void setError(ErrorDetails error) {
        this.error = error;
    }

    // Inner class for Error details
    public static class ErrorDetails implements Serializable {

        @SerializedName("message")
        private String message;

        @SerializedName("code")
        private String code;

        // Getters and setters
        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }
}
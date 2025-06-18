package com.scribetech.speechsdkandroid.Interfaces;

import com.scribetech.speechsdkandroid.SpeechCommand.ActionRecipe;

/**
 * Speech SDK interface for augnito events callback
 */
public interface IAugnitoSpeechOutputCallback {

    void AugnitoSpeechEventCallback(String eventType, String eventValue);
    void AugnitoHypothesesCallback(String hypotheses);
    void AugnitoErrorCallback(String message);
    void AugnitoFinalOutputCallback(ActionRecipe actionRecipe);
}

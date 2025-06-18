package com.scribetech.speechsdkandroid;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.scribetech.speechsdkandroid.Interfaces.ISocketEvents;
import com.scribetech.speechsdkandroid.Interfaces.IAugnitoSpeechOutputCallback;
import com.scribetech.speechsdkandroid.SpeechCommand.ActionRecipe;
import com.scribetech.speechsdkandroid.SpeechCommand.CMDDictionary;

import org.json.JSONObject;

import java.net.URISyntaxException;

/**
 * Class to connect to web socket and handle/process socket messages
 */
public class AugnitoSpeechAudio implements ISocketEvents {

    WebSocketWrapper ws = null;
    AudioWrapper audioWrapper = null;
    Context _context;
    Activity _mainActivity;
    IAugnitoSpeechOutputCallback _speechOutputCallback;

    public String ServerUrl;
    public String AccountCode;
    public String AccessKey;
    public int LmId;
    public String UserTag;
    public String LoginToken;
    public int NoiseCt;
    public String OtherInfo;
    public String ContentType;

    private String appSource = "AndroidNativeSDK";

    public String getAppSource() {
        return appSource;
    }

    private String PrepareSpeechURL() {

        String speechUrl = String.format("%1$s?content-type=%2$s&accountcode=%3$s&accesskey=%4$s&lmid=%5$s&usertag=%6$s&logintoken=%7$s&noisect=-%8$s&otherinfo=%9$s&sourceapp=%10$s",
                this.ServerUrl, this.ContentType, this.AccountCode, this.AccessKey, this.LmId, this.UserTag,
                this.LoginToken, this.NoiseCt, this.OtherInfo, this.getAppSource());
        return speechUrl;
    }

    public AugnitoSpeechAudio(IAugnitoSpeechOutputCallback speechOutputCallback, String ServerUrl, String AccountCode, String AccessKey,
                              int LmId, String UserTag, String LoginToken, int NoiseCt,
                              String OtherInfo,String ContentType) {
        _speechOutputCallback = speechOutputCallback;
        this.ServerUrl = ServerUrl;
        this.AccountCode = AccountCode;
        this.AccessKey = AccessKey;
        this.LmId = LmId;
        this.UserTag = UserTag;
        this.LoginToken = LoginToken;
        this.NoiseCt = NoiseCt;
        this.OtherInfo = OtherInfo;
        this.ContentType = ContentType;
    }

    /**
     * Initiate web socket connection
     * @param activity
     * @return AugnitoSpeechResult
     * @throws URISyntaxException
     */
    public AugnitoSpeechResult StartSpeech(Activity activity) throws URISyntaxException {
        _context = activity.getApplicationContext();
        _mainActivity = activity;
        if (ws != null) {
            return AugnitoSpeechResult.AlreadyConnected;
        }
        ws = WebSocketWrapper.Create(PrepareSpeechURL(), this);
        if(ws!=null){
            ws.Connect();
            return AugnitoSpeechResult.Success;
        }
        else {
            return AugnitoSpeechResult.InvalidURL;
        }

    }

    /**
     * Stop audio recording and disconnect speech server
     * @return AugnitoSpeechResult
     */
    public AugnitoSpeechResult StopSpeech() {
        if (audioWrapper != null) {
            audioWrapper.StopRecord();
        }

        if (ws != null) {
            ws.CloseWS();
            ws.Dispose();
        }
        ws = null;
        audioWrapper = null;
        return AugnitoSpeechResult.Success;
    }

    @Override
    public void OnConnected() {

        try{
            audioWrapper = new AudioWrapper(_context, _mainActivity);
            audioWrapper.StartRecord(ws);
        }
        catch (Exception e){
            Log.i("Error", e.getMessage());
            _speechOutputCallback.AugnitoErrorCallback(e.getMessage());
        }

    }

    /**
     *Implementation method if the ISocketEvents interface to process web socket messages
     * @param message
     */
    @Override
    public void OnMessage(String message) {
        try {
            JSONObject jsonResponse = new JSONObject(message);
            if ((jsonResponse.has("status") && jsonResponse.optString("status").equals("0")) ||
                    jsonResponse.has("Status") && jsonResponse.optString("Status").equals("0")) {
                boolean isMeta = (jsonResponse.has("Type") && jsonResponse.optString("Type").equals("meta"));
                if (isMeta) // If the response is a meta response
                {
                    JSONObject metaToken = jsonResponse.optJSONObject("Event");
                    if (metaToken.has("Type") && metaToken.has("Value")) {
                        String eventType = metaToken.optString("Type");
                        String EventValue = metaToken.optString("Value");
                        //send event response
                        _speechOutputCallback.AugnitoSpeechEventCallback(eventType, EventValue);
                    }
                } else if (jsonResponse.has("Result")) {
                    JSONObject resultJson = jsonResponse.optJSONObject("Result");
                    boolean isFinal = resultJson.optBoolean("Final");
                    String receivedText = "" + resultJson.optString("Transcript");

                    if (isFinal) {
                        ActionRecipe actionRecipe = new ActionRecipe();
                        String cm = resultJson.optString("IsCommand");
                        actionRecipe.Action = resultJson.optString("Action");
                        actionRecipe.IsCommand = actionRecipe.IsStaticCommand = (cm != null && "true".equals(cm.toLowerCase()));
                        actionRecipe.ReceivedText = receivedText;
                        actionRecipe = CMDDictionary.Lookup(actionRecipe);
                        _speechOutputCallback.AugnitoFinalOutputCallback(actionRecipe);
                    } else {
                        // send hypotheses event
                        _speechOutputCallback.AugnitoHypothesesCallback(receivedText);

                    }
                }
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            _speechOutputCallback.AugnitoErrorCallback(ex.getMessage());
        }
    }

    @Override
    public void OnErrorCallback(String exception) {

        Log.i("Error", exception);
        _speechOutputCallback.AugnitoErrorCallback(exception);
    }

    @Override
    public void OnDisconnected(String message) {

        try {
            if (audioWrapper != null) {
                audioWrapper.StopRecord();
            }
            audioWrapper = null;

            if (ws != null) {
                ws.Dispose();
            }
            ws = null;
            _speechOutputCallback.AugnitoSpeechEventCallback("SOCKET_DISCONNECT", message);
        }catch (Exception e){
            Log.i("Error", e.getMessage());
            _speechOutputCallback.AugnitoErrorCallback(e.getMessage());
        }
    }
}

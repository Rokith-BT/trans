package com.scribetech.speechsdkandroid;

import com.scribetech.speechsdkandroid.Interfaces.ISocketEvents;

import java.net.URI;
import java.net.URISyntaxException;

import tech.gusavila92.websocketclient.WebSocketClient;

/**
 * Wrapper class to create, connect, open, close web socket and also send data and receive text from the socket
 */
public class WebSocketWrapper {
    private WebSocketClient _ws = null;
    private ISocketEvents _socketEvents;

    private WebSocketWrapper(String uriString, ISocketEvents _socketEvents) throws URISyntaxException {
        this._socketEvents = _socketEvents;
        URI uri;
        try {
            uri = new URI(uriString);
        } catch (URISyntaxException e) {
            e.printStackTrace();
            throw e;
        }
        _ws = new WebSocketClient(uri) {
            @Override
            public void onOpen() {
                _socketEvents.OnConnected();
            }

            @Override
            public void onTextReceived(String message) {
                _socketEvents.OnMessage(message);
            }

            @Override
            public void onBinaryReceived(byte[] data) {

            }

            @Override
            public void onPingReceived(byte[] data) {

            }

            @Override
            public void onPongReceived(byte[] data) {

            }

            @Override
            public void onException(Exception e) {
                _socketEvents.OnErrorCallback(e.getMessage());
            }

            @Override
            public void onCloseReceived() {
                _socketEvents.OnDisconnected("Close");
            }
        };
    }

    public static WebSocketWrapper Create(String uri, ISocketEvents socketEvents) throws URISyntaxException {

        if(uri!=null && uri.length()>0){
            return new WebSocketWrapper(uri, socketEvents);
        }
        else {
            return null;
        }
    }

    public WebSocketWrapper Connect() {
        try {
            _ws.connect();
        } catch (Exception ex) {
            if (this._socketEvents != null) {
                this._socketEvents.OnErrorCallback(ex.getMessage());
            }
        }
        return this;
    }

    public void CloseWS() {
        try {
            if (_ws != null) {
                _ws.close();
            }

        } catch (Exception ex) {
            if (this._socketEvents != null) {
                this._socketEvents.OnErrorCallback(ex.getMessage());
            }
        }

    }

    public void Dispose() {
        try {
            _ws = null;
        } catch (Exception ex) {
            if (this._socketEvents != null) {
                this._socketEvents.OnErrorCallback(ex.getMessage());
            }
        }
    }

    public void SendMessage(byte[] audioChunk, int offset, int count) {
        try {
            if(_ws!=null){
                _ws.send(audioChunk);
            }

        } catch (Exception ex) {
            if (this._socketEvents != null) {
                this._socketEvents.OnErrorCallback(ex.getMessage());
            }
        }
    }
}


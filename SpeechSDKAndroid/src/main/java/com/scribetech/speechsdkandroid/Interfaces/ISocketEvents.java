package com.scribetech.speechsdkandroid.Interfaces;

/**
 * Socket events interface
 */
public interface ISocketEvents {

    void OnConnected();
    void OnMessage(String message);
    void OnErrorCallback(String exception);
    void OnDisconnected(String message);
}

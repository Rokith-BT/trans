package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class BookAppointmentOnlineRes {
    @SerializedName("merchantId")
    String merchantId;
    @SerializedName("reqData")
    String reqData;
    @SerializedName("transactionNumber")
    String transactionNumber;

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public String getReqData() {
        return reqData;
    }

    public void setReqData(String reqData) {
        this.reqData = reqData;
    }

    public String getTransactionNumber() {
        return transactionNumber;
    }

    public void setTransactionNumber(String transactionNumber) {
        this.transactionNumber = transactionNumber;
    }

    public static class BookAppointmentOnlineReq3 {
        @SerializedName("api")
        String api;

        @SerializedName("method")
        String method;

        public String getApi() {
            return api;
        }

        public void setApi(String api) {
            this.api = api;
        }

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }
    }
}

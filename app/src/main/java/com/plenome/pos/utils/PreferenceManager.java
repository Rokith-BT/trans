package com.plenome.pos.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferenceManager {

    private static SharedPreferences preferences;
    public static String SESSION_TOKEN = "session_token";
    public static String PASSWORD = "password";
    public static String USER_NAME = "user_name";
    public static String USER_TYPE = "user_type";
    public static String STAFF_NAME = "staff_name";
    public static String EMPLOYEE_ID = "employee_id";
    public static String ABHA_ID = "abha_id";
    public static String STAFF_IMAGE = "staff_img";
    public static String HOSPITAL_IMAGE = "Hospital_image";
    public static String HOSPITAL_LOGO = "Hospital_logo";
    public static String HOSPITAL_ID = "hospital_id";
    public static String HOSPITAL_NAME = "hospital_name";
    public static String HOSPITAL_ADDRESS = "hospital_address";
    public static String STAFF_ID = "staff_id";
    public static String PATIENT_ID = "patient_Id";

    public static String HITYPE_ID = "hitype_id";
    public static String IS_REM_PWD = "rem_pwd";
    public static String IS_LOGGED_IN = "is_logged_in";
    public static String PAGE_COUNT = "page_count";
    public static String DOC_FROM_DATE = "dec_date";
    public static String DOC_FIT_GENTERS = "genters";
    public static String DOC_FIT_SPLICALITY = "specialitys";
    public static String APPOINTMENT_FILTER = "appt_filter";
    public static String APPT_FROM_DATE = "from_date";
    public static String APPT_TO_DATE = "to_date";
    public static String APPT_DOCTOR = "doctor";
    public static String APPT_STATUS = "appt_status";
    public static String APPT_PAYMENT_STATUS = "appt_payment_status";
    public static String APPT_STATUS_ID = "appt_status_id";
    public static String TODAY_APPOINTMENT_FILTER = "today_appt_filter";
    public static String TODAY_APPT_DOCTOR = "today_doctor";
    public static String TODAY_APPT_STATUS = "today_appt_status";
    public static String TODAY_APPT_PAYMENT_STATUS = "today_appt_payment_status";
    public static String TODAY_APPT_STATUS_ID = "today_appt_status_id";


    public static String TODAY_APPT_FROM_DATE = "today_from_date";
    public static String TODAY_APPT_TO_DATE = "today_to_date";



    public static String APPOINTMENT_HIST_FILTER = "appt_history_filter";
    public static String APPT_HIST_FROM_DATE = "hist_from_date";
    public static String APPT_HIST_TO_DATE = "hist_to_date";
    public static String APPT_HIST_DOCTOR = "hist_doctor";
    public static String APPT_HIST_STATUS = "hist_appt_status";
    public static String APPT_HIST_PAYMENT_STATUS = "hist_appt_payment_status";
    public static String APPT_HIST_STATUS_ID = "hist_appt_status_id";

    public static String BILLING_FILTER = "billing_filter";
    public static String BILLING_FROM_DATE = "from_date";
    public static String BILLING_TO_DATE = "to_date";
    public static String BILLING_PATIENT_ID = "patient_id";
    public static String BILLING_PAYMENT_METHOD = "payment_method";

    public static String BILLING_PENDING_FILTER = "pending_bill_filter";
    public static String BILLING_PENDING_FROM_DATE = "pending_bill_from_date";
    public static String BILLING_PENDING_TO_DATE = "pending_bill_to_date";
    public static String BILLING_PENDING_PATIENT_ID = "pending_bill_patient_id";
    public static String BILLING_PENDING_PAYMENT_METHOD = "pending_bill_payment_method";
    public static String ACCESS_TOKEN = "token";
    public static String OPD_ID = "OPDID";
    public static String DEVICE_CLICK = "device_click";
    public static String ROLE_NAME = "ROLENAME";
    public static String CLICKED_INDEX = "INDEX";

    public static final String APPOINTMENT_ID = "appointment_id";
    public static final String APPOINTMENT_TOKEN = "appointment_token";
    public static final String FROM_SCREEN = "from_screen";
    public static final String FROM_TAB = "from_tab";
    public static final String TO_TAB = "to_tab";
    public static final String APPT_FEES = "appt_fees";
    public static final String VITALS = "vitals";

    public static void initializePreferenceManager(SharedPreferences _preferences) {
        preferences = _preferences;
    }

    public static boolean getBoolean(String key, boolean defaultValue) {
        return preferences.getBoolean(key, defaultValue);
    }

    public static void setBoolean(String key, boolean value) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(key, value);
        editor.commit();
    }

    public static int getInt(String key, int defaultValue) {
        return preferences.getInt(key, defaultValue);
    }

    public static void setInt(String key, int value) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putInt(key, value);
        editor.commit();
    }


    public static Long getLong(String key, long defaultValue) {
        return preferences.getLong(key, defaultValue);
    }

    public static void setLong(String key, long value) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(key, value);
        editor.commit();
    }

    public static String getString(String key, String defaultValue) {
        return preferences.getString(key, defaultValue);
    }

    public static void setString(String key, String value) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static void setDouble( String key, double value) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(key, Double.doubleToRawLongBits(value));
        editor.apply();
    }

    public static double getDouble(String key, double defaultValue) {
        return preferences.getLong(key, Double.doubleToRawLongBits(defaultValue));
    }
}

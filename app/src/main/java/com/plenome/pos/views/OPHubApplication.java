package com.plenome.pos.views;

import android.app.Application;
import android.content.Context;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.ayati.connectvibrasense.main.VibrasenseConnect;
import com.plenome.pos.utils.PreferenceManager;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.LibraryManager.OmronPeripheralManager;

public class OPHubApplication extends Application {

    Context context;
    public static TextView appBarTitle;
    public static ImageView appBarImage, appBarQR;
    public static EditText appBareditTextSearch;
    public static RelativeLayout relFragment, relMain, relPatient;
    public static ScrollView scrollView, flagScrollView;
    public static ListView flagListView;
    private final String ORG_ID = "AD-IITMAD-1703747516080";

    private final String PARTNER_API_KEY = "360C121C-0E53-437D-A38C-C0EE054718DA";

    private final String SALT = "U6eB9uL0Vme4hFtxgEqnpRWHrQv+PQ2FSqZ5vGupSXozX1MA8GynQ+mE+fqFd2iu+16ZWgYSrZ+m1Z57sSXugEZaNUYlIwn4icfbAEpvQDUr8fRoeX9d/b03cIvuu3uvCBrYhkLqiu48KDGYBVVqnxQ1nIm+J8PO/LQed4/fr5hm2btjaak2G+jeiPOhQNel0YwE+4mvgTD1LwdTKUb78bJWF8fu5fmu2n/vsyYzGaZM2UC9B5V1RX8EKcyhXxVfzRZy3wzrm44lOlC9ZkIrsEU/NNyNKjMSK+0Sxf2K4Ea/eHrqKaXsPkHysUuYGoiMe8w3sv7Er6d4MyOBNWOt9Q==";

    private final String KEY = "9xjlYEGZTQ1eiEHz8GZRpg==";
    public static int currentPage = 1, pageCount = 10;
    public static String selTab = "Appointment", billingSelTab = "Pending_Bills", selApptOption="",selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus;

    @Override
    public void onCreate() {
        super.onCreate();
        context = this;
        VibrasenseConnect.init(this,ORG_ID, SALT, KEY);
        PreferenceManager.initializePreferenceManager(android.preference.PreferenceManager.getDefaultSharedPreferences(this));
        // VibrasenseConnect.init(this, ORG_ID, SALT, KEY,
        //       new ColorResource().setSCREEN_BG("#990000").setSCREEN_TITLE("#000099").setBTN_DEFAULT_BG("#009900").setTV_DARK("#999000").setTV_LIGHT("#000999").setBTN_CLEAR_BG("#000000").setLOADER("#009900").setLOADER_INDICATOR("#000000"));
//        VibrasenseConnect.init(this, ORG_ID, SALT, KEY, new ColorResource().setSCREEN_BG("#FFFFFF"));
        OmronPeripheralManager.sharedManager(this).setAPIKey(PARTNER_API_KEY, null);
    }


    public static String getSessionToken() {
        return PreferenceManager.getString(PreferenceManager.SESSION_TOKEN, null);
    }

    public static Boolean isUserLoggedIn() {
        return PreferenceManager.getBoolean(PreferenceManager.IS_LOGGED_IN, false);
    }

    public static String getPassword() {
        return PreferenceManager.getString(PreferenceManager.PASSWORD, null);
    }

    public static String getUserName() {
        return PreferenceManager.getString(PreferenceManager.USER_NAME, null);
    }

    public static String getStaffName() {
        return PreferenceManager.getString(PreferenceManager.STAFF_NAME, null);
    }
    public static String getEmployeeId() {
        return PreferenceManager.getString(PreferenceManager.EMPLOYEE_ID, null);
    }

    public static int getHospitalId() {
        return PreferenceManager.getInt(PreferenceManager.HOSPITAL_ID, 0);
    }

    public static int getPaientId() {
        return PreferenceManager.getInt(PreferenceManager.PATIENT_ID, 0);
    }

    public static String getHospitalName() {
        return PreferenceManager.getString(PreferenceManager.HOSPITAL_NAME, null);
    }

    public static String getHospitalAddress() {
        return PreferenceManager.getString(PreferenceManager.HOSPITAL_ADDRESS, null);
    }

    public static String getHitypeId() {
        return PreferenceManager.getString(PreferenceManager.HITYPE_ID, null);
    }

    public static int getStaffId() {
        return PreferenceManager.getInt(PreferenceManager.STAFF_ID, 0);
    }

    public static String getStaffImage() {
        return PreferenceManager.getString(PreferenceManager.STAFF_IMAGE, null);
    }

    public static String getHospitalImage() {
        return PreferenceManager.getString(PreferenceManager.HOSPITAL_IMAGE, null);
    }

    public static String getHospitalLogo() {
        return PreferenceManager.getString(PreferenceManager.HOSPITAL_LOGO, null);
    }


    public static String getUserType() {
        return PreferenceManager.getString(PreferenceManager.USER_TYPE, null);
    }

    public static Boolean isRemPwd() {
        return PreferenceManager.getBoolean(PreferenceManager.IS_REM_PWD, false);
    }

    public static int getPageCount() {
        return PreferenceManager.getInt(PreferenceManager.PAGE_COUNT, 0);
    }

    public static boolean isBillingFilterSet() {
        return PreferenceManager.getBoolean(PreferenceManager.BILLING_FILTER, false);
    }

    public static String getBillingSelFromDate() {
        return PreferenceManager.getString(PreferenceManager.BILLING_FROM_DATE, null);
    }

    public static String getBillingSelToDate() {
        return PreferenceManager.getString(PreferenceManager.BILLING_TO_DATE, null);
    }

    public static String getBillingPatientId() {
        return PreferenceManager.getString(PreferenceManager.BILLING_PATIENT_ID, null);
    }

    public static String getBillingPaymentMethod() {
        return PreferenceManager.getString(PreferenceManager.BILLING_PAYMENT_METHOD, null);
    }

    public static boolean isPendingBillFilterSet() {
        return PreferenceManager.getBoolean(PreferenceManager.BILLING_PENDING_FILTER, false);
    }

    public static String getPendingBillSelFromDate() {
        return PreferenceManager.getString(PreferenceManager.BILLING_PENDING_FROM_DATE, null);
    }

    public static String getPendingBillSelToDate() {
        return PreferenceManager.getString(PreferenceManager.BILLING_PENDING_TO_DATE, null);
    }

    public static String getPendingBillPatientId() {
        return PreferenceManager.getString(PreferenceManager.BILLING_PENDING_PATIENT_ID, null);
    }

    public static String getPendingBillPaymentMethod() {
        return PreferenceManager.getString(PreferenceManager.BILLING_PENDING_PAYMENT_METHOD, null);
    }

    public static boolean isApptFilterSet() {
        return PreferenceManager.getBoolean(PreferenceManager.APPOINTMENT_FILTER, false);
    }

    public static String getSelFromDate() {
        return PreferenceManager.getString(PreferenceManager.APPT_FROM_DATE, null);
    }

    public static String getSelToDate() {
        return PreferenceManager.getString(PreferenceManager.APPT_TO_DATE, null);
    }

    public static String getSelDoctor() {
        return PreferenceManager.getString(PreferenceManager.APPT_DOCTOR, null);
    }

    public static String getSelApptStatus() {
        return PreferenceManager.getString(PreferenceManager.APPT_STATUS, null);
    }

    public static String getSelApptStatusId() {
        return PreferenceManager.getString(PreferenceManager.APPT_STATUS_ID, null);
    }

    public static String getSelPaymentStatus() {
        return PreferenceManager.getString(PreferenceManager.APPT_PAYMENT_STATUS, null);
    }

    public static String gettodaySelFromDate() {
        return PreferenceManager.getString(PreferenceManager.TODAY_APPT_FROM_DATE, null);
    }
    public static String gettodaySelToDate() {
        return PreferenceManager.getString(PreferenceManager.TODAY_APPT_TO_DATE, null);
    }
    public static boolean isTodayApptFilterSet() {
        return PreferenceManager.getBoolean(PreferenceManager.TODAY_APPOINTMENT_FILTER, false);
    }
    public static String getTodaySelDoctor() {
        return PreferenceManager.getString(PreferenceManager.TODAY_APPT_DOCTOR, null);
    }
    public static String getTodaySelApptStatus() {
        return PreferenceManager.getString(PreferenceManager.TODAY_APPT_STATUS, null);
    }

    public static String getTodaySelApptStatusId() {
        return PreferenceManager.getString(PreferenceManager.TODAY_APPT_PAYMENT_STATUS, null);
    }

    public static String getTodaySelPaymentStatus() {
        return PreferenceManager.getString(PreferenceManager.TODAY_APPT_STATUS_ID, null);
    }


    public static boolean isHistFilterSet() {
        return PreferenceManager.getBoolean(PreferenceManager.APPOINTMENT_HIST_FILTER, false);
    }

    public static String getHistSelFromDate() {
        return PreferenceManager.getString(PreferenceManager.APPT_HIST_FROM_DATE, null);
    }

    public static String getHistSelToDate() {
        return PreferenceManager.getString(PreferenceManager.APPT_HIST_TO_DATE, null);
    }

    public static String getHistSelDoctor() {
        return PreferenceManager.getString(PreferenceManager.APPT_HIST_DOCTOR, null);
    }

    public static String getHistSelApptStatus() {
        return PreferenceManager.getString(PreferenceManager.APPT_HIST_STATUS, null);
    }

    public static String getHistSelApptStatusId() {
        return PreferenceManager.getString(PreferenceManager.APPT_HIST_STATUS_ID, null);
    }

    public static String getHistSelPaymentStatus() {
        return PreferenceManager.getString(PreferenceManager.APPT_HIST_PAYMENT_STATUS, null);
    }

    public static String getHistFromDate() {
        return PreferenceManager.getString(PreferenceManager.DOC_FROM_DATE, null);
    }
    public static String getDocGenter() {
        return PreferenceManager.getString(PreferenceManager.DOC_FIT_GENTERS, null);
    }

    public static String getDocSpeciality() {
        return PreferenceManager.getString(PreferenceManager.DOC_FIT_SPLICALITY, null);
    }

    private static OPHubApplication mInstance = null;

    public OPHubApplication() {
        mInstance = this;
    }

    public static OPHubApplication getInstance() {
        return mInstance;
    }

    public static String getAccessToken() {
        return PreferenceManager.getString(PreferenceManager.ACCESS_TOKEN, null);
    }
    public static String getOPID() {
        return PreferenceManager.getString(PreferenceManager.OPD_ID, null);
    }

    public static String getDeviceClik() {
        return PreferenceManager.getString(PreferenceManager.DEVICE_CLICK, null);
    }

    public static String getClickedIndex() {
        return PreferenceManager.getString(PreferenceManager.CLICKED_INDEX, null);
    }


}

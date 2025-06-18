package com.plenome.pos.network;

import static com.plenome.pos.BuildConfig.IMAGE_URL;

import com.plenome.pos.BuildConfig;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.OPHubApplication;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitInstance {
    private static Retrofit retrofit;
    public static final String ABHA_URL = "https://abha-api.plenome.com/";
    public static final String SARVAM_URL = "https://api.sarvam.ai/";

    public static final String razorPay_URL = "https://api.razorpay.com/v1/";

    //    public static final String BASE_URL = "http://13.200.35.19:6001/";
   public static final String FILE_URL = "http://13.200.35.19:7000/";
//    public static final String BASE_TEST_URL = "http://3.111.115.65:6001/";
   // public static final String FILE_TEST_URL = "http://3.111.115.65:7000/";

 //   public static final String BASE_PROD_URL = "http://3.108.145.57:6001/";
   // public static final String FILE_PROD_URL = "http://3.108.145.57:7000/";

    private static OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

    private static Retrofit.Builder builder =
            new Retrofit.Builder()
                    .baseUrl(BuildConfig.BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create());

    private static Retrofit.Builder abhaBuilder =
            new Retrofit.Builder()
                    .baseUrl(ABHA_URL)
                    .addConverterFactory(GsonConverterFactory.create());

    private static Retrofit.Builder razorPay =
            new Retrofit.Builder()
                    .baseUrl(razorPay_URL)
                    .addConverterFactory(GsonConverterFactory.create());

    private static Retrofit.Builder fileBuilder =
            new Retrofit.Builder()
                    .baseUrl(BuildConfig.FILE_URL)
                    .addConverterFactory(GsonConverterFactory.create());

    private static Retrofit.Builder imageurl =
            new Retrofit.Builder()
                    .baseUrl(IMAGE_URL)
                    .addConverterFactory(GsonConverterFactory.create());

    private static Retrofit.Builder sarvamBuilder =
            new Retrofit.Builder()
                    .baseUrl(SARVAM_URL)
                    .addConverterFactory(GsonConverterFactory.create());

    public static <S> S createService(Class<S> serviceClass) {
        OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();

        // Interceptor to add token and refresh if 403
        clientBuilder.addInterceptor(new Interceptor() {
            @Override
            public Response intercept(Chain chain) throws IOException {
                Request originalRequest = chain.request();
                String token = OPHubApplication.getAccessToken();

                Request.Builder requestBuilder = originalRequest.newBuilder();
                if (token != null && !token.isEmpty()) {
                    requestBuilder.header("authorization", token);
                }

                Request requestWithToken = requestBuilder.build();
                Response response = chain.proceed(requestWithToken);

                if (response.code() == 403) {
                    response.close();

                    String newToken = refreshAuthToken();
                    if (newToken != null) {

                        PreferenceManager.setString(PreferenceManager.ACCESS_TOKEN, newToken);
                        Request newRequest = originalRequest.newBuilder()
                                .header("authorization", newToken)
                                .build();
                        return chain.proceed(newRequest);
                    }
                }

                return response;
            }
        });

        // Add logging interceptor
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);
        clientBuilder.addInterceptor(logging);

        // Set timeouts
        clientBuilder.connectTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS);

        builder.client(clientBuilder.build());
        retrofit = builder.build();
        return retrofit.create(serviceClass);
    }

    public static <S> S createAbhaService(
            Class<S> serviceClass) {
        OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();

        // Interceptor to add token and refresh if 403
        clientBuilder.addInterceptor(new Interceptor() {
            @Override
            public Response intercept(Chain chain) throws IOException {
                Request originalRequest = chain.request();
                String token = OPHubApplication.getAccessToken();

                Request.Builder requestBuilder = originalRequest.newBuilder();
                if (token != null && !token.isEmpty()) {
                    requestBuilder.header("authorization", token);
                }

                Request requestWithToken = requestBuilder.build();
                Response response = chain.proceed(requestWithToken);

                if (response.code() == 403) {
                    response.close();

                    String newToken = refreshAuthToken();
                    if (newToken != null) {

                        PreferenceManager.setString(PreferenceManager.ACCESS_TOKEN, newToken);
                        Request newRequest = originalRequest.newBuilder()
                                .header("authorization", newToken)
                                .build();
                        return chain.proceed(newRequest);
                    }
                }

                return response;
            }
        });

        // Add logging interceptor
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);
        clientBuilder.addInterceptor(logging);

        // Set timeouts
        clientBuilder.connectTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS);

        abhaBuilder.client(clientBuilder.build());
        retrofit = abhaBuilder.build();
        return retrofit.create(serviceClass);
    }
    private static String refreshAuthToken() {
        try {
            Retrofit refreshRetrofit = new Retrofit.Builder()
                    .baseUrl(BuildConfig.BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            RestServices service = refreshRetrofit.create(RestServices.class);
            Call<OPHubResponse.TokenResponse> call = service.getAccessToken(OPHubApplication.getUserName(),OPHubApplication.getAccessToken());
            retrofit2.Response<OPHubResponse.TokenResponse> response = call.execute();
            if (response.isSuccessful() && response.body() != null) {
                return response.body().getAccessToken();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static <S> S createRazorpayService(
            Class<S> serviceClass) {
        razorPay.client(httpClient.build());
        retrofit = razorPay.build();
        return retrofit.create(serviceClass);
    }

    public static <S> S createFileService(
            Class<S> serviceClass) {
        fileBuilder.client(httpClient.build());
        retrofit = fileBuilder.build();
        return retrofit.create(serviceClass);
    }

    public static <S> S createImageUrl(
            Class<S> serviceClass) {
        imageurl.client(httpClient.build());
        retrofit = imageurl.build();
        return retrofit.create(serviceClass);
    }

    public static <S> S createSarvamService(
            Class<S> serviceClass) {
        sarvamBuilder.client(httpClient.build());
        retrofit = sarvamBuilder.build();
        return retrofit.create(serviceClass);
    }

}
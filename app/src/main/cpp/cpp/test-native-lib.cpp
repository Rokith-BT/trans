#include <jni.h>
#include <string>
#include <iostream>
#include "Test.h"


//extern "C"
//jstring
//Java_com_example_VIBRASENSE_utils_GlobalVar_baseUrlFromJNI(
//        JNIEnv* env,
//        jobject /* this */) {
//   std::string baseURL = "aHR0cHM6Ly92aWJyYXNlbnNlLmxpdmUvYXBpLw==";
//    return env->NewStringUTF(baseURL.c_str());
//}







//
//extern "C" JNIEXPORT jobject JNICALL
//Java_com_ayati_demosointegrationpoc_GlobalVar_getTestReport(JNIEnv *env, jclass /* this */, jstring data) {
//    const char *dataStr = env->GetStringUTFChars(data, 0);
//
//    std::string inputData(dataStr);
//    env->ReleaseStringUTFChars(data, dataStr);
//
//    // Call the C++ function using your generated header file
//    Test test;
//    std::vector<std::string> result = test.getTestReport(inputData);
//
//
//    // Convert the vector of strings to a Java ArrayList
//    jclass arrayListClass = env->FindClass("java/util/ArrayList");
//    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
//    jobject arrayList = env->NewObject(arrayListClass, arrayListConstructor);
//
//    jmethodID arrayListAdd = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");
//
//    try {
//        for (const auto &str : result) {
//            jstring jStr = env->NewStringUTF(str.c_str());
//            env->CallBooleanMethod(arrayList, arrayListAdd, jStr);
//            env->DeleteLocalRef(jStr);
//        }
//    } catch (...) {
//        // Handle exception, clear it, and return an appropriate value
//        env->ExceptionDescribe();
//        env->ExceptionClear();
//        return nullptr; // or another appropriate value
//    }
//
//    return arrayList;
//
//}



extern "C" JNIEXPORT jobject JNICALL
Java_com_ayati_demosointegrationpoc_GlobalVar_getTestReport(JNIEnv *env, jclass /* this */, jstring data) {
    const char *dataStr = env->GetStringUTFChars(data, nullptr);
    if (dataStr == nullptr) {
        // Failed to get string data
        return nullptr;
    }

    std::cout << data << std::endl;

    std::string inputData(dataStr);
    env->ReleaseStringUTFChars(data, dataStr);

    // Call the C++ function using your generated header file
    Test test;
    std::vector<std::string> result;
    try {
        result = test.getTestReport(inputData);
    } catch (...) {
        // Handle exception, clear it, and return an appropriate value
        env->ExceptionDescribe();
        env->ExceptionClear();
        return nullptr; // or another appropriate value
    }

    // Create a new Java ArrayList
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    if (arrayListClass == nullptr) {
        return nullptr;
    }

    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    if (arrayListConstructor == nullptr) {
        return nullptr;
    }

    jobject arrayList = env->NewObject(arrayListClass, arrayListConstructor);
    if (arrayList == nullptr) {
        return nullptr;
    }

    // Get the "add" method of ArrayList
    jmethodID arrayListAdd = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");
    if (arrayListAdd == nullptr) {
        return nullptr;
    }

    // Add strings to the ArrayList
    try {
        for (const auto &str : result) {
            jstring jStr = env->NewStringUTF(str.c_str());
            if (jStr == nullptr) {
                return nullptr;
            }
            env->CallBooleanMethod(arrayList, arrayListAdd, jStr);
            env->DeleteLocalRef(jStr);
        }
    } catch (...) {
        // Handle exception, clear it, and return an appropriate value
        env->ExceptionDescribe();
        env->ExceptionClear();
        return nullptr; // or another appropriate value
    }

    // Don't delete the arrayList reference here
    // env->DeleteLocalRef(arrayList);

    result.clear();

    return arrayList;
}
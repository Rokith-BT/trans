#include <jni.h>
#include <string>
#include <iostream>
#include "Test.h"



extern "C" JNIEXPORT jobject JNICALL
Java_com_plenome_pos_views_vibrasense_VibrasenseUtils_getReport(JNIEnv *env, jclass /* this */, jstring data) {
    const char *dataStr = env->GetStringUTFChars(data, 0);

    std::string inputData(dataStr);
    env->ReleaseStringUTFChars(data, dataStr);

    // Call the C++ function using your generated header file
    Test test;
    std::vector<std::string> result = test.getTestReport(inputData);


    // Convert the vector of strings to a Java ArrayList
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jobject arrayList = env->NewObject(arrayListClass, arrayListConstructor);

    jmethodID arrayListAdd = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    try {
        for (const auto &str : result) {
            jstring jStr = env->NewStringUTF(str.c_str());
            env->CallBooleanMethod(arrayList, arrayListAdd, jStr);
            env->DeleteLocalRef(jStr);
        }
    } catch (...) {
        // Handle exception, clear it, and return an appropriate value
        env->ExceptionDescribe();
        env->ExceptionClear();
        return nullptr; // or another appropriate value
    }

    return arrayList;

}


